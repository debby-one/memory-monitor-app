# Memory Monitor App

This project is a memory and swap monitoring application built with Node.js. It monitors the memory and swap usage on a Linux server and sends notifications when the usage exceeds specified thresholds.

## Project Structure

```
memory-monitor-app
├── src
│   ├── app.js          # Entry point of the application
│   ├── monitor
│   │   ├── memory.js   # Monitors memory usage
│   │   └── swap.js     # Monitors swap usage
│   └── notifier
│       └── notify.js   # Sends notifications
├── package.json        # npm configuration file
├── .env                # Environment variables
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/memory-monitor-app.git
   cd memory-monitor-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and define the necessary variables, such as notification settings and threshold values.

4. **Run the application:**
   ```bash
   node src/app.js
   ```

## Usage

The application will start monitoring the memory and swap usage. If the usage exceeds the defined thresholds, it will trigger notifications to alert the user.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.