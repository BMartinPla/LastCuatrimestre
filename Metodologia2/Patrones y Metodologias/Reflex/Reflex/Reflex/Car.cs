using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reflex
{
    public class Car
    {
        private int _year;
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { 
            get { return _year; } 
            set
            {
                if (value < 1886 || value > DateTime.Now.Year +1)
                {
                    throw new ArgumentException("Please enter a valid manufacturing year.");
                }
                _year = value;
            }
        }

        public Car(string make, string model, int year)
        {
            Make = make;
            Model = model;
            Year = year;
        }

        public void StartEngine()
        {
            Console.WriteLine($"The engine of the {Year} {Make} {Model} is now running!");
        }
    }
}
