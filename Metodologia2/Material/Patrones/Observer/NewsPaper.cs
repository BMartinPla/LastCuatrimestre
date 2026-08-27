using System;
using System.Runtime.CompilerServices;

namespace Observer;

public class NewsPaper : ISubscriber
{
    public void Update(string news)
    {
        Console.WriteLine($"Object Id: {RuntimeHelpers.GetHashCode(this)} - {news}");
        Console.WriteLine("---------------------------------------------");
    }
}