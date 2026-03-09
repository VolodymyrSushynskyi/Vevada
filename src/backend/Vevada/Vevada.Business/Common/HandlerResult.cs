namespace Vevada.Business.Common;

public class HandlerResult<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private HandlerResult(bool isSuccess, T? value, string? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static HandlerResult<T> Success(T value) => new HandlerResult<T>(true, value, null);
    public static HandlerResult<T> Failure(string error) => new HandlerResult<T>(false, default, error);
}
