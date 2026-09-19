# ImageSense

**ImageSense – Image Similarity & Duplicate Detection Tool**

ImageSense is a lightweight web-based application that analyzes and compares images to identify visually similar or duplicate images. The application provides a simple interface for uploading images, comparing them, and analyzing their similarity.

### Tech Stack

* Python
* Flask
* OpenCV
* NumPy
* HTML
* CSS
* JavaScript

## Project Overview

ImageSense uses image processing techniques to compare images based on their visual characteristics. It calculates similarity between images and helps users identify duplicate or closely matching images.

The application provides a simple workflow where users can upload images, select the required comparison operation, and view the results.

## Project Modules

The application consists of the following modules:

* **Home Page** – Provides an introduction to the application and navigation to available features.
* **Image Comparison** – Allows users to upload and compare two images.
* **Duplicate Detection** – Helps identify similar or duplicate images from a collection.
* **Similarity Analysis** – Calculates and displays the similarity between images.

## Features

* Upload and compare images
* Image similarity detection
* Duplicate image identification
* Histogram-based image comparison
* Simple and user-friendly interface
* Fast image processing using OpenCV
* Web-based interface using Flask

## How It Works

1. Upload the required images.
2. The application processes the uploaded images using OpenCV.
3. Image features are analyzed using image histograms.
4. NumPy is used for numerical processing and similarity calculations.
5. The application compares the images using histogram correlation.
6. The similarity result is displayed to the user.


<img width="1767" height="846" alt="Screenshot 2026-09-19 180410" src="https://github.com/user-attachments/assets/e215c056-4bb9-4fc0-a538-30b1c86e4390" />


<img width="852" height="652" alt="Screenshot 2026-09-19 180450" src="https://github.com/user-attachments/assets/b608f4fb-049c-489c-a9a4-3ee942c9c798" />


<img width="1770" height="578" alt="Screenshot 2026-09-19 180501" src="https://github.com/user-attachments/assets/885638f3-0808-47cd-8d7a-2bad5e5a4b69" />


<img width="1003" height="641" alt="Screenshot 2026-09-19 180529" src="https://github.com/user-attachments/assets/1ee21d15-6f6d-4360-895d-8e859c8d191b" />

<img width="795" height="462" alt="Screenshot 2026-09-19 180553" src="https://github.com/user-attachments/assets/03e45db9-2374-4592-b917-8fb907cd8072" />






## Image Similarity Technique

ImageSense uses **histogram correlation** to compare images.

The images are processed and their color/visual histograms are generated. The histograms are then compared to determine how closely the images match.

A higher correlation value indicates greater similarity between the images.

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/ImageSense.git
```

Navigate to the project directory:

```bash
cd ImageSense
```

Install the required dependencies:

```bash
pip install flask opencv-python numpy
```

## Run the Application

Start the Flask application:

```bash
python app.py
```

Open the application in your browser:

```text
http://127.0.0.1:5000
```

## Use Cases

ImageSense can be useful for:

* Detecting duplicate images
* Comparing similar images
* Organizing image collections
* Basic image analysis
* Educational image-processing projects

## Project Objective

The objective of ImageSense is to provide a simple and efficient tool for comparing images and identifying visually similar or duplicate images using Python-based image processing techniques.

## Future Enhancements

* Support for multiple image comparison
* More advanced feature extraction
* Deep-learning-based image similarity
* Improved duplicate detection
* Similarity result visualization
* Image database integration


