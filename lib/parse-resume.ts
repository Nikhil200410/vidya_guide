// Server-side only: parse PDF, DOCX, TXT to extract resume text

export async function extractTextFromFile(
  buffer: ArrayBuffer,
  mimeType: string,
  filename: string
): Promise<string> {
  if (mimeType === "text/plain" || filename.endsWith(".txt")) {
    return new TextDecoder().decode(buffer)
  }

  if (
    mimeType === "application/pdf" ||
    filename.toLowerCase().endsWith(".pdf")
  ) {
    try {
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(Buffer.from(buffer))
      return data.text ?? ""
    } catch (pdfErr) {
      const msg = pdfErr instanceof Error ? pdfErr.message : ""
      if (
        msg.includes("XRef") ||
        msg.includes("Invalid") ||
        msg.includes(" corrupted") ||
        msg.includes("password")
      ) {
        throw new Error(
          "This PDF could not be read. Try exporting as a new PDF, saving as DOCX, or copying the text into a .txt file. Some PDFs (e.g. scanned images, password-protected) are not supported."
        )
      }
      throw new Error("Could not parse this PDF. Try using DOCX or TXT format instead.")
    }
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.toLowerCase().endsWith(".docx")
  ) {
    try {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
      return result.value ?? ""
    } catch (docxErr) {
      throw new Error(
        "Could not read this DOCX file. Try saving as a new file or exporting as PDF/TXT."
      )
    }
  }

  throw new Error("Unsupported file type. Use PDF, DOCX, or TXT.")
}
