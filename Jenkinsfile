pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        MONGO_USERNAME = 'admin'
        MONGO_PASSWORD = '12345'
        MONGO_DB = 'itisdev-mvp'
        MONGO_URI = "mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@itisdev-mvp.jary1la.mongodb.net/${MONGO_DB}"
    }

    stages {
        stage('Verify Tools') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Checkout') {
            steps {
                git 'https://github.com/megan-ryleneryl/ISDEVOP.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage('Test') {
            steps {
                // sh 'npm test'
                echo 'TODO: Prepare tests'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                // sh 'npm start' // Can comment this out
            }
        }

        stage('Security Check') {
            steps {
                echo 'TODO: Implement security check'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                        # Kill any existing process on port 3000
                        pkill -f "node app.js" || true
                        
                        # Start the application with explicit host binding
                        HOST=0.0.0.0 node app.js > app.log 2>&1 &
                        echo $! > app.pid
                        
                        # Give the app some time to start
                        sleep 5
                        
                        # Check if process is running
                        if ps -p $(cat app.pid) > /dev/null; then
                            # Check app.log for successful startup message
                            if grep "App started. Listening on port" app.log; then
                                echo "Application started successfully"
                                cat app.log
                            else
                                echo "Application failed to start properly"
                                cat app.log
                                exit 1
                            fi
                        else
                            echo "Application process not found"
                            cat app.log
                            exit 1
                        fi
                    '''
                }
            }
        }
    }

    post {
        failure {
            sh '''
                if [ -f app.pid ]; then
                    pid=$(cat app.pid)
                    rm app.pid
                    kill -9 $pid || true
                fi
            '''
        }
        always {
            echo 'Pipeline finished!'
        }
    }
}
