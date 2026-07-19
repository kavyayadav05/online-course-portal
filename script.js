function getCourses() {
  return JSON.parse(localStorage.getItem("courses")) || [];
}

function saveCourses(data) {
  localStorage.setItem("courses", JSON.stringify(data));
}
// REGISTER
function register() {
  let u = document.getElementById("regUser").value;
  let p = document.getElementById("regPass").value;

  if (!u || !p) {
    console.log("❌ Fill all fields");
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(x => x.u === u)) {
    console.log("⚠ User already exists");
    alert("User already exists");
    return;
  }

  users.push({ u, p });
  localStorage.setItem("users", JSON.stringify(users));

  console.log("✅ Successfully Registered:", u);
  alert("Registered Successfully");

  // OPTIONAL: clear fields
  document.getElementById("regUser").value = "";
  document.getElementById("regPass").value = "";
}
// LOGIN
function login() {
  let u = document.getElementById("loginUser").value;
  let p = document.getElementById("loginPass").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let valid = users.find(x => x.u === u && x.p === p);

  if (valid) {
    console.log("✅ Login Success:", u);

    localStorage.setItem("loggedInUser", u);
    window.location.href = "dashboard.html";

  } else {
    console.log("❌ Invalid Login Attempt:", u);
    alert("Invalid Login");
  }
}
// ADD COURSE
function addCourse() {
  let name = document.getElementById("courseName").value;
  let cat = document.getElementById("category").value;

  if (!name || !cat) return alert("Enter details");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  courses.push({
    id: Date.now(),
    name,
    cat,
    progress: 0,
    enrolledStudents: [] // ✅ VERY IMPORTANT
  });

  localStorage.setItem("courses", JSON.stringify(courses));

  console.log("Course Added:", name);

  displayCourses();
}

// DELETE
function deleteCourse(id) {
  let courses = getCourses();
  courses = courses.filter(c => c.id !== id);
  saveCourses(courses);
  displayCourses();
}

// ENROLL
function enrollCourse(id) {
  let user = localStorage.getItem("loggedInUser");
  let courses = getCourses();

  courses.forEach(c => {
    if (c.id === id && !c.enrolledStudents.includes(user)) {
      c.enrolledStudents.push(user);
    }
  });

  saveCourses(courses);
  displayCourses();
}

// PROGRESS
function increaseProgress(id) {
  let user = localStorage.getItem("loggedInUser");
  let courses = getCourses();

  courses.forEach(c => {
    if (c.id === id && c.enrolledStudents.includes(user)) {
      if (c.progress < 100) c.progress += 10;
    }
  });

  saveCourses(courses);
  displayCourses();
}

// SEARCH + FILTER
function applySearchAndFilter() {
  let s = document.getElementById("search").value.toLowerCase();
  let f = document.getElementById("filter").value.toLowerCase();

  let courses = getCourses();

  let filtered = courses.filter(c =>
    c.name.toLowerCase().includes(s) &&
    c.cat.toLowerCase().includes(f)
  );

  show(filtered);
}
function clearFilter() {
  document.getElementById("search").value = "";
  document.getElementById("filter").value = "";

  displayCourses();
}
// DISPLAY
function displayCourses() {
  show(getCourses());
}

// SHOW UI
function show(data) {
  let list = document.getElementById("courseList");
  let user = localStorage.getItem("loggedInUser");

  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<p>No courses found</p>";
    return;
  }

  data.forEach(c => {

    // ✅ FIX OLD DATA STRUCTURE
    if (!c.enrolledStudents) {
      c.enrolledStudents = [];
    }

    let enrolled = c.enrolledStudents.includes(user);

    list.innerHTML += `
      <div class="card">
        <h3>${c.name}</h3>
        <p>Category: ${c.cat}</p>
        <p>Students: ${c.enrolledStudents.length}</p>

        <p>Status: ${enrolled ? "Enrolled" : "Not Enrolled"}</p>

        <progress value="${c.progress}" max="100"></progress>
        <p>${c.progress}%</p>

        <button onclick="enrollCourse(${c.id})">
          ${enrolled ? "Enrolled" : "Enroll"}
        </button>

        <button onclick="increaseProgress(${c.id})">+10%</button>
        <button onclick="deleteCourse(${c.id})">Delete</button>

        ${
          c.progress === 100 && enrolled
            ? `<a href="certificate.html"><button>Certificate</button></a>`
            : ""
        }
      </div>
    `;
  });
}
window.onload = function () {
  console.log("Page Loaded ✅");
  displayCourses();
};
