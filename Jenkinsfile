pipeline {
    agent { label 'master' }

    stages {
        stage('Build') {
            steps {
                sh 'rm ./dist ./build',
                sh 'electron-builder -wl --ai32 deb tar.gz',
                archiveArtifacts artifacts: './build/*.tar.gz', fingerprint: true,
                archiveArtifacts artifacts: './build/*.deb', fingerprint: true,
                archiveArtifacts artifacts: './build/*.exe', fingerprint: true,
            }
        }
    }
}
