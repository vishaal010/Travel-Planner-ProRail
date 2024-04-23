using Domain;

namespace API.FileHandler;

public static class UploadedFileTracker
{
    private static readonly List<UploadedFile> _uploadedFiles = new List<UploadedFile>();

    public static void AddFile(string fileName, string filePath)
    {
        _uploadedFiles.Add(new UploadedFile
        {
            FileName = fileName,
            FilePath = filePath,
            UploadedOn = DateTime.UtcNow,
            IsProcessed = false
        });
    }

    public static IEnumerable<UploadedFile> GetUnprocessedFiles()
    {
        return _uploadedFiles.Where(file => !file.IsProcessed);
    }

    public static void MarkFileAsProcessed(string fileName)
    {
        var file = _uploadedFiles.FirstOrDefault(f => f.FileName == fileName);
        if (file != null)
        {
            file.IsProcessed = true;
        }
    }
}
