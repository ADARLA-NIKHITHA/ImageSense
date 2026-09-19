from flask import Flask, render_template, request, send_from_directory
import os
from werkzeug.utils import secure_filename
from itertools import combinations
from similarity import compare_images, find_duplicates

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ======================
# 1️⃣ LANDING PAGE
# ======================
@app.route('/')
def landing():
    return render_template('landing.html')


# ======================
# 2️⃣ MODULES PAGE
# ======================
@app.route('/modules')
def modules():
    return render_template('modules.html')


# ======================
# 3️⃣ COMPARE MODULE
# ======================
@app.route('/compare', methods=['GET', 'POST'])
def compare():
    if request.method == 'POST':
        files = request.files.getlist('images')

        image_paths = []

        for file in files:
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(path)
                image_paths.append(path)

        results = []

        for img1, img2 in combinations(image_paths, 2):
            score = compare_images(img1, img2)
            results.append({
                "img1": os.path.basename(img1),
                "img2": os.path.basename(img2),
                "score": score
            })

        return render_template('compare.html', results=results)

    return render_template('compare.html')


# ======================
# 4️⃣ DUPLICATE PAGE
# ======================
@app.route('/duplicates')
def duplicates_page():
    return render_template('duplicates.html')


# ======================
# 5️⃣ FIND DUPLICATES (FIXED)
# ======================
@app.route('/find-duplicates', methods=['POST'])
def find_duplicates_route():
    if 'files[]' not in request.files:
        return "No files uploaded"

    files = request.files.getlist('files[]')

    image_paths = []

    for file in files:
        if file.filename == '':
            continue

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        image_paths.append(filepath)

    # ✅ FIXED HERE (ONLY 1 ARGUMENT)
    duplicates = find_duplicates(image_paths)

    return render_template('duplicates.html', duplicates=duplicates)


# ======================
# 6️⃣ DISPLAY IMAGES
# ======================
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ======================
# RUN
# ======================
if __name__ == '__main__':
    app.run(debug=True)