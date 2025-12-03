namespace MainHub.Api.Shared
{
    /// <summary>
    /// Wheel Drive Type enumeration
    /// </summary>
    public enum WheelDriveType
    {
        /// <summary>
        /// Front Wheel Drive
        /// </summary>
        FWD,

        /// <summary>
        /// Rear Wheel Drive
        /// </summary>
        RWD,

        /// <summary>
        /// All Wheel Drive
        /// </summary>
        AWD,

        /// <summary>
        /// Four Wheel Drive
        /// </summary>
        FourWD
    }

    /// <summary>
    /// Fuel Type enumeration
    /// </summary>
    public enum FuelType
    {
        Gasoline,
        Diesel,
        Electric,
        Hybrid,
        PlugInHybrid,
        Hydrogen
    }

    /// <summary>
    /// Transmission Type enumeration
    /// </summary>
    public enum TransmissionType
    {
        Manual,
        Automatic,
        CVT, // Continuously Variable Transmission
        SemiAutomatic,
        DualClutch
    }
}



