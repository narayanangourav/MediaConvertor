# MediaConvertor

A full-stack application for converting text to audio and extracting audio from videos, built with FastAPI and React.

## 🚀 Deployment Prerequisites

To deploy this application to AWS using the CI/CD pipeline, you need to set up the following:

### 1. AWS EC2 Instance Setup

1.  **Launch an Instance**:

    - Go to AWS Console -> EC2 -> Launch Instance.
    - Choose **Ubuntu Server 22.04 LTS** (or later).
    - Instance Type: **t2.micro** (Free Tier eligible) or larger.
    - Key Pair: Create a new key pair (e.g., `media-convertor-key`) and **download the .pem file**.
    - Security Group: Allow inbound traffic on ports **22 (SSH)**, **80 (HTTP)**, and **443 (HTTPS)**.

2.  **Install Docker & Docker Compose on EC2**:
    SSH into your instance:

    ```bash
    ssh -i path/to/key.pem ubuntu@your-ec2-public-ip
    ```

    Run the following commands:

    ```bash
    # Update packages
    sudo apt-get update

    # Install Docker
    sudo apt-get install -y docker.io

    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Add user to docker group (avoids using sudo for docker commands)
    sudo usermod -aG docker $USER

    # Install Docker Compose
    sudo apt-get install -y docker-compose

    # Apply group changes (or logout and login again)
    newgrp docker
    ```

### 2. GitHub Repository Secrets

Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**. Add the following:

| Secret Name       | Value Description                                                                                                                                                               |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AWS_HOST`        | The Public IPv4 address or DNS of your EC2 instance (e.g., `54.123.45.67`).                                                                                                     |
| `AWS_USER`        | The username for SSH access. For Ubuntu instances, it is usually `ubuntu`.                                                                                                      |
| `SSH_PRIVATE_KEY` | The content of your `.pem` key file. Open the file with a text editor and copy **everything**, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`. |
| `SECRET_KEY`      | A strong random string for backend security (e.g., generate with `openssl rand -hex 32`).                                                                                       |

### 3. GitHub Container Registry (GHCR) Access

The CI/CD pipeline pushes images to GHCR. Ensure your workflow has permissions (already configured in `ci-cd.yml`), but you might need to enable "Read and write permissions" for GITHUB_TOKEN in **Settings** -> **Actions** -> **General** -> **Workflow permissions**.

---

## 🛠 Local Development

To run the application locally using Docker:

1.  **Clone the repository**:

    ```bash
    git clone <your-repo-url>
    cd MediaConvertor
    ```

2.  **Run with Docker Compose**:

    ```bash
    docker-compose up --build
    ```

3.  **Access the App**:
    - Frontend: [http://localhost](http://localhost)
    - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🧪 Running Tests

The CI pipeline automatically runs tests. To run them locally:

**Backend:**

```bash
cd backend
pip install -r requirements.txt
pytest
```

**Frontend:**

```bash
cd frontend
npm install
npm test
```
