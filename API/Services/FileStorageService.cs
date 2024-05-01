namespace API.Services;

public class FileStorageService
{
    private List<string> _filePaths = new List<string>();

    public void AddFilePath(string filePath)
    {
        _filePaths.Add(filePath);
    }

    public List<string> GetFilePaths()
    {
        return _filePaths;
    }

    public void ClearFilePaths()
    {
        _filePaths.Clear();
    }
}
