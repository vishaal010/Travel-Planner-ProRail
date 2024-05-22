namespace Domain;

public class StationName
{
    public string Key { get; set; }
    public string Value { get; set; }

    public override bool Equals(object obj)
    {
        return obj is StationName name && Key == name.Key && Value == name.Value;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Key, Value);
    }
}
