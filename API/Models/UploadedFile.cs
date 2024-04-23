namespace Domain;

public class UploadedFile
{
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public DateTime UploadedOn { get; set; }
    public bool IsProcessed { get; set; }
}