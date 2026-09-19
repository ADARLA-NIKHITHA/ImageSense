document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadStatus = document.getElementById('uploadStatus');
    const resultsContainer = document.getElementById('resultsContainer');
    const numGroupsSpan = document.getElementById('numGroups');
    const originalImagesCount = document.getElementById('originalImagesCount');
    const afterDedupCount = document.getElementById('afterDedupCount');
    const removedDuplicatesCount = document.getElementById('removedDuplicatesCount');
    const compressionRateSpan = document.getElementById('compressionRate');
    const imageGroupsArea = document.getElementById('imageGroupsArea');
    const downloadAllButton = document.getElementById('downloadAllButton');
    const finalMessage = document.getElementById('finalMessage');

    let allImageGroupsData = []; // Store fetched image groups data

    uploadButton.addEventListener('click', async () => {
        const files = imageUpload.files;
        if (files.length === 0) {
            uploadStatus.textContent = 'Please select images to upload.';
            return;
        }

        uploadStatus.textContent = 'Uploading and processing images...';
        uploadButton.disabled = true;
        resultsContainer.style.display = 'none';
        imageGroupsArea.innerHTML = '';
        finalMessage.textContent = '';


        const formData = new FormData();
        for (const file of files) {
            formData.append('files[]', file);
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            allImageGroupsData = data.image_groups; // Store the data

            displayResults(data);
            uploadStatus.textContent = 'Images processed!';

        } catch (error) {
            console.error('Error:', error);
            uploadStatus.textContent = `Error: ${error.message}`;
            resultsContainer.style.display = 'none';
        } finally {
            uploadButton.disabled = false;
        }
    });

    downloadAllButton.addEventListener('click', async () => {
        if (allImageGroupsData.length === 0) {
            finalMessage.textContent = 'No images to deduplicate or download.';
            return;
        }

        downloadAllButton.disabled = true;
        finalMessage.textContent = 'Finalizing deduplication...';

        try {
            const response = await fetch('/api/deduplicate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_groups: allImageGroupsData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Deduplication finalization failed');
            }

            const result = await response.json();
            finalMessage.textContent = result.message;

            // In a real scenario, you'd trigger a download of a ZIP file of kept images
            // For this basic example, we'll just indicate success.
            // A more advanced Flask setup could create a zip on the fly and send it.
            if (result.success && result.kept_files.length > 0) {
                finalMessage.textContent += " (Downloading of kept images would happen here)";
                // You could dynamically create a download link or trigger a new endpoint
                // which zips files from the 'results' folder and sends it.
            }

        } catch (error) {
            console.error('Error finalizing deduplication:', error);
            finalMessage.textContent = `Error finalizing deduplication: ${error.message}`;
        } finally {
            downloadAllButton.disabled = false;
        }
    });


    function displayResults(data) {
        resultsContainer.style.display = 'block';

        // Update statistics
        const stats = data.deduplication_statistics;
        originalImagesCount.textContent = stats.original_images;
        afterDedupCount.textContent = stats.after_dedup;
        removedDuplicatesCount.textContent = stats.removed_duplicates;
        compressionRateSpan.textContent = `${stats.compression_rate}%`;
        numGroupsSpan.textContent = data.image_groups.length;

        imageGroupsArea.innerHTML = ''; // Clear previous groups

        data.image_groups.forEach((group, groupIndex) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'image-group';

            groupDiv.innerHTML = `
                <div class="group-header">
                    <h3>Group ${groupIndex + 1} - ${group.images.length} images</h3>
                    <div class="similarity-info">
                        Avg Similarity: ${group.avg_similarity}%
                        <span class="similarity-label ${group.similarity_label.toLowerCase().replace(' ', '-')}" >${group.similarity_label}</span>
                    </div>
                </div>
                <p class="group-instructions">
                    Click the circle to select which image to keep. Blue "Recommended" tag indicates the largest file
                </p>
                <div class="image-list" id="group-${group.id}">
                    <!-- Image cards will go here -->
                </div>
            `;
            imageGroupsArea.appendChild(groupDiv);

            const imageList = groupDiv.querySelector('.image-list');

            group.images.forEach(image => {
                const imageCard = document.createElement('div');
                imageCard.className = 'image-card';
                if (image.action === 'Keep') {
                    imageCard.classList.add('selected');
                }

                imageCard.innerHTML = `
                    <input type="radio" class="image-radio" name="group-${group.id}" id="image-${image.id}" ${image.action === 'Keep' ? 'checked' : ''} data-image-id="${image.id}">
                    <span class="action-label ${image.action.toLowerCase()}">${image.action}</span>
                    ${image.recommended ? '<span class="recommended-label">Recommended</span>' : ''}
                    <img src="${image.path}" alt="${image.original_filename}">
                    <div class="image-filename">${image.original_filename}</div>
                    <div class="image-size">${image.size_mb} MB</div>
                    <div class="file-status ${image.action === 'Keep' ? 'selected-text' : ''}">${image.action === 'Keep' ? 'Largest File ✓ Selected' : ''}</div>
                `;
                imageList.appendChild(imageCard);

                // Add event listener to the custom radio button and card itself
                const radio = imageCard.querySelector('.image-radio');
                radio.addEventListener('change', () => handleSelection(group.id, image.id, groupIndex));
                imageCard.addEventListener('click', (e) => {
                    if (e.target !== radio) { // Prevent double-triggering if clicking the radio directly
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change')); // Manually trigger change to update state
                    }
                });
            });
        });
        updateOverallStats();
    }


    function handleSelection(groupId, selectedImageId, groupIndex) {
        // Update selection in our allImageGroupsData
        allImageGroupsData.forEach(group => {
            if (group.id === groupId) {
                group.images.forEach(img => {
                    if (img.id === selectedImageId) {
                        img.action = 'Keep';
                    } else {
                        img.action = 'Remove';
                    }
                });
            }
        });

        // Update UI for the specific group
        const imageList = document.getElementById(`group-${groupId}`);
        if (imageList) {
            imageList.querySelectorAll('.image-card').forEach(card => {
                const cardImageId = card.querySelector('.image-radio').dataset.imageId;
                const imgData = allImageGroupsData[groupIndex].images.find(img => img.id === cardImageId);

                card.classList.remove('selected');
                card.querySelector('.action-label').classList.remove('keep', 'remove');
                card.querySelector('.file-status').textContent = '';
                card.querySelector('.file-status').classList.remove('selected-text');

                if (imgData.action === 'Keep') {
                    card.classList.add('selected');
                    card.querySelector('.action-label').classList.add('keep');
                    card.querySelector('.action-label').textContent = 'Keep';
                    card.querySelector('.file-status').textContent = '✓ Selected'; // Remove "Largest File" here as it might not be the largest if user overrides
                    card.querySelector('.file-status').classList.add('selected-text');
                } else {
                    card.querySelector('.action-label').classList.add('remove');
                    card.querySelector('.action-label').textContent = 'Remove';
                }
            });
        }
        updateOverallStats();
    }


    function updateOverallStats() {
        let totalOriginal = 0;
        let totalKept = 0;
        let totalRemoved = 0;

        allImageGroupsData.forEach(group => {
             group.images.forEach(img => {
                totalOriginal++;
                if (img.action === 'Keep') {
                    totalKept++;
                } else {
                    totalRemoved++;
                }
            });
        });

        const compressionRate = (totalOriginal > 0) ? Math.round((totalRemoved / totalOriginal) * 100) : 0;

        originalImagesCount.textContent = totalOriginal;
        afterDedupCount.textContent = totalKept;
        removedDuplicatesCount.textContent = totalRemoved;
        compressionRateSpan.textContent = `${compressionRate}%`;
    }

});
