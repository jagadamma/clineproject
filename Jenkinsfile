stage('Restart App in Background') {
    steps {
        echo "🚀 Restarting app and ensuring port $PORT is free..."
        sh '''
        set -euo pipefail

        echo "🔍 Killing any process using port $PORT..."
        PID=$(lsof -ti tcp:$PORT || true)
        if [ -n "$PID" ]; then
          echo "Found process $PID using port $PORT, killing..."
          kill -9 $PID || true
        else
          echo "No process found on port $PORT."
        fi

        echo "📂 Changing to project directory..."
        cd "$WORKSPACE"

        echo "🧼 Cleaning previous logs..."
        rm -f "$WORKSPACE/$LOG_FILE"

        echo "📦 Starting app in background using nohup + node..."
        nohup node src/app.js > "$WORKSPACE/$LOG_FILE" 2>&1 &

        echo "⏱️ Waiting for app to start..."
        sleep 5

        echo "🧪 Testing app response..."
        curl -s http://localhost:$PORT || echo "⚠️ App not reachable yet."

        echo "✅ App started in background. Check log at $WORKSPACE/$LOG_FILE"
        '''
    }
}
