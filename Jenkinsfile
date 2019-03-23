pipeline {
    agent { label 'master' }

    stages {
        stage('Build-Linux') {
            steps {
                sh 'electron-builder -l tar.gz'
                archiveArtifacts artifacts: './build/*.tar.gz', fingerprint: true
            }
        }
        stage('Build-Windows') {
            steps {
                sh 'rm ./build -rf'
                sh 'electron-builder -w'
                sh 'zip -r ./windows.zip ./build'
                archiveArtifacts artifacts: './windows.zip', fingerprint: true
            }
        }
    }
}
