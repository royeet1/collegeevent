pipeline {
    agent any

    environment {
        PATH = "C:\\Windows\\System32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Program Files\\Git\\cmd;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Program Files\\Java\\jdk-25.0.3\\bin;${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Spring Boot') {
            steps {
                bat '.\\mvnw.cmd clean package'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t collegeevent:v1 .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s\\deployment.yaml'
                bat 'kubectl apply -f k8s\\service.yaml'
                bat 'kubectl rollout restart deployment/collegeevent-deployment'
            }
        }
    }

    post {
        success {
            echo 'College Event Website deployed successfully!'
        }

        failure {
            echo 'Build failed. Please check the console output.'
        }
    }
}