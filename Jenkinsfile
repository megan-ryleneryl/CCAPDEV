pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/megan-ryleneryl/CCAPDEV.git'
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
                sh 'node app.js'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'TODO: Add monitoring and logging'
            }
        }

        stage('Security Check') {
            steps {
                echo 'TODO: Implement security check'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}
