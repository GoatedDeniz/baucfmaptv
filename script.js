// Classroom mapping (Classroom → Floor)
const classrooms = {
    "GLTTV": -2, "DARKROOM": -2, "GLTMOVIE": -2, "GLTEDIT1": -2, "GLTEDIT2": -2, 
    "GLTEDIT3": -2, "GLTCEP": -2,
    "GLTSC01": 2, "GLTSC03": 2, "GLTBUG": 2,
    "GLT301 (NETFLIX CLASS)": 3, "FTV GREEN BOX STUDIO": 3, "GLTVLOG": 3, "CINEMA (CINE-HALL)": 3,
    "VR LAB": 4, "AQUARIUM CLASS": 4,
    "GLTSC02": 5, "GLTMAC01 (TANZER MAC)": 5,
    "GLTBASIC": 6, "GLTANIM": 6, "GLTMAC02": 6, "GLT601": 6,
    "GLT705": 7, "GLT701": 7, "GLT704": 7, "GLT702": 7, "GLTMAC03": 7, "GLT703": 7
};

// Floor color mapping
const floorColors = {
    "-2": "#000000", "0": "#000000", "2": "#E888B7", "3": "#618E3F", "4": "#2D54A1",
    "5": "#B6373D", "6": "#764695", "7": "#96D6D8", "8": "#F08211", "9": "#FFD022"
};

// Function to check if dark mode is enabled
function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Function to convert classroom names to valid file format
function formatClassroomName(classroom) {
    return classroom.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Function to show the selected floor (Now Loads Highlighted SVGs if available)
function showFloor(floor, highlight = null) {
    let floorMap = document.getElementById("floorMap");

    // Check if dark mode is enabled
    let darkModeSuffix = isDarkMode() ? "-dark" : "";

    // Determine the correct file to load
    let baseFileName = `floor-${floor}${darkModeSuffix}`;
    let fileToLoad = highlight ? `${baseFileName}.${formatClassroomName(highlight)}.svg` : `${baseFileName}.svg`;

    // Load SVG from GitHub raw link
    const svgUrl = `https://raw.githubusercontent.com/GoatedDeniz/baucfmap/main/${fileToLoad}`;

    floorMap.src = svgUrl;
    floorMap.onerror = function () {
        this.onerror = null; // Prevent infinite loop if fallback also fails
        this.src = `https://raw.githubusercontent.com/GoatedDeniz/baucfmap/main/floor-${floor}.svg`; // Default to light mode if dark mode file is missing
    };

    // Remove "active" class from all buttons
    document.querySelectorAll(".floor-selector button").forEach(button => {
        button.classList.remove("active");
        button.style.backgroundColor = ""; // Reset button color
        button.style.color = ""; // Reset text color
    });

    // Add "active" class and change color of clicked button
    let selectedButton = document.querySelector(`button[onclick="showFloor(${floor})"]`);
    if (selectedButton) {
        selectedButton.classList.add("active");

        // Change button background color based on floor theme
        if (floorColors[floor]) {
            selectedButton.style.backgroundColor = floorColors[floor];
            selectedButton.style.color = "#FFFFFF"; // Ensure text is visible
        } else {
            selectedButton.style.backgroundColor = "#CCCCCC"; // Default gray if no color found
            selectedButton.style.color = "#000000";
        }
    }

    // Ensure suggestions disappear when floor changes
    hideSuggestions();
}

// Function to handle search
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let query = this.value.toUpperCase().trim();

        if (classrooms[query]) {
            showFloor(classrooms[query], query); // Switch to highlighted floor plan
            this.value = ""; // Clear search input
        }

        hideSuggestions(); // Close auto-suggestions immediately
        event.preventDefault(); // Prevent unnecessary form submission on mobile
    }
});

// Function to update auto-suggestions
function updateSuggestions(query) {
    let suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = "";

    if (query.length === 0) {
        hideSuggestions();
        return;
    }

    let matched = Object.keys(classrooms).filter(classroom => classroom.includes(query));

    if (matched.length > 0) {
        matched.forEach(classroom => {
            let suggestion = document.createElement("li");
            suggestion.textContent = classroom;
            suggestion.onclick = function () {
                document.getElementById("searchInput").value = classroom;
                showFloor(classrooms[classroom], classroom); // Show highlighted version
                hideSuggestions();
            };
            suggestionsBox.appendChild(suggestion);
        });
        suggestionsBox.style.display = "block";
    } else {
        hideSuggestions();
    }
}

// Function to hide suggestions
function hideSuggestions() {
    document.getElementById("suggestions").style.display = "none";
}

// Hide suggestions when clicking outside the search bar
document.addEventListener("click", function (event) {
    if (!event.target.closest(".search-container")) {
        hideSuggestions();
    }
});

// Listen for input changes to update suggestions dynamically
document.getElementById("searchInput").addEventListener("input", function () {
    updateSuggestions(this.value.toUpperCase().trim());
});

// Get elements
const infoIcon = document.getElementById("infoIcon");
const infoContainer = document.querySelector(".info-container");

// Function to toggle the info box
function toggleInfo() {
    let infoText = document.getElementById("infoText");
    let infoIcon = document.getElementById("infoIcon");

    // Toggle visibility of info box
    if (infoText.style.display === "block") {
        infoText.style.display = "none";
    } else {
        infoText.style.display = "block";
    }

    // Add grow-shrink animation every time it's clicked
    infoIcon.classList.add("animate");
    setTimeout(() => {
        infoIcon.classList.remove("animate");
    }, 200); // Remove animation class after animation completes

    // ✅ Check for dark mode and switch icon accordingly
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        infoIcon.src = "info-dark.svg"; // Dark mode icon
    } else {
        infoIcon.src = "info.svg"; // Light mode icon
    }
}

// ✅ Ensure correct icon loads on page load based on dark mode
window.addEventListener("DOMContentLoaded", function() {
    let infoIcon = document.getElementById("infoIcon");

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        infoIcon.src = "info-dark.svg";
    } else {
        infoIcon.src = "info.svg";
    }
});

// ✅ Ensure correct icon loads on page load based on dark mode
window.addEventListener("DOMContentLoaded", function() {
    let infoIcon = document.getElementById("infoIcon");

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        infoIcon.src = "info-dark.svg";
    } else {
        infoIcon.src = "info.svg";
    }
});

// Detect dark mode changes and update the floor map dynamically
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    let activeFloor = document.querySelector(".floor-selector button.active");
    if (activeFloor) {
        let floor = activeFloor.getAttribute("data-floor");
        showFloor(floor);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const uiElements = document.querySelectorAll(".movable"); // Select all movable elements
    
    uiElements.forEach(element => {
        let clickCount = 0;
        let isDragging = false;
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        element.addEventListener("click", function () {
            clickCount++;
            
            setTimeout(() => clickCount = 0, 500); // Reset click count if not consecutive
            
            if (clickCount === 3) {
                activateMoveScale(element);
            }
        });
    });

    function activateMoveScale(element) {
        if (element.querySelector(".resize-handle")) return; // Prevent duplicate handles
        
        element.style.position = "absolute";
        element.style.cursor = "move";
        
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        element.appendChild(resizeHandle);
        
        resizeHandle.addEventListener("mousedown", startResizing);
        element.addEventListener("mousedown", startDragging);
        
        function startDragging(e) {
            if (isResizing) return;
            
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            
            document.addEventListener("mousemove", dragElement);
            document.addEventListener("mouseup", stopDragging);
        }
        
        function dragElement(e) {
            if (!isDragging) return;
            
            element.style.left = `${e.clientX - startX}px`;
            element.style.top = `${e.clientY - startY}px`;
        }
        
        function stopDragging() {
            isDragging = false;
            document.removeEventListener("mousemove", dragElement);
            document.removeEventListener("mouseup", stopDragging);
        }
        
        function startResizing(e) {
            isResizing = true;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
            startX = e.clientX;
            startY = e.clientY;
            
            document.addEventListener("mousemove", resizeElement);
            document.addEventListener("mouseup", stopResizing);
        }
        
        function resizeElement(e) {
            if (!isResizing) return;
            
            element.style.width = `${startWidth + (e.clientX - startX)}px`;
            element.style.height = `${startHeight + (e.clientY - startY)}px`;
        }
        
        function stopResizing() {
            isResizing = false;
            document.removeEventListener("mousemove", resizeElement);
            document.removeEventListener("mouseup", stopResizing);
        }
    }
});
