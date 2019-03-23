pipeline {
    agent { label 'master' }

    stages {
        stage('Build') {
            steps {
                sh 'electron-builder -l tar.gz'
                sh 'electron-builder -w'
                sh 'zip -r ./windows.zip ./build/win-unpacked'
                archiveArtifacts artifacts: './build/*.tar.gz', fingerprint: true
                archiveArtifacts artifacts: './windows.zip', fingerprint: true
            }
        }
    }
}
