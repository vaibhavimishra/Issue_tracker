function submitIssue(e) {
  // e.preventDefault(); // Prevent the form from submitting

  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random() * 100000000) + '';
  const status = 'Open';

  if (description.trim() === '' || assignedTo.trim() === '') {
    alert('Please fill in all required fields.'); // Display an error message
    document.getElementById('add-issue').setAttribute("data-toggle", "modal");
    document.getElementById('add-issue').setAttribute("data-target", "#emptyField")
  } else {
    document.getElementById('add-issue').removeAttribute("data-toggle", "modal");
    document.getElementById('add-issue').removeAttribute("data-target", "#emptyField")
    const issue = { id, description, severity, assignedTo, status };
    let issues = [];
    if (localStorage.getItem('issues')) {
      issues = JSON.parse(localStorage.getItem('issues'));
    }
    issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(issues));

    fetchIssues();

    // Clear the form inputs after successful submission
    document.getElementById('issueDescription').value = '';
    document.getElementById('issueSeverity').value = 'Low';
    document.getElementById('issueAssignedTo').value = '';
  }
}


const closeIssue = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => issue.id == id);
  currentIssue.status = 'Closed';
  currentIssue.description = `<strike>${currentIssue.description}</strike>`
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

const deleteIssue = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const remainingIssues = issues.filter(issue => ((issue.id) != id))
  localStorage.removeItem('issues');
  localStorage.setItem('issues', JSON.stringify(remainingIssues));
  fetchIssues();
}
// const fetchIssues = () => {

//   const issues = JSON.parse(localStorage.getItem('issues'));
//   const issuesList = document.getElementById('issuesList');
//   issuesList.innerHTML = '';

//   for (var i = 0; i < issues.length; i++) {
//     const { id, description, severity, assignedTo, status } = issues[i];

//     issuesList.innerHTML += `<div class="well">
//                               <h6>Issue ID: ${id} </h6>
//                               <p><span class="label label-info"> ${status} </span></p>
//                               <h3> ${description} </h3>
//                               <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
//                               <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
//                               <button onclick="closeIssue(${id})" class="btn btn-warning">Close</button>
//                               <button onclick="deleteIssue(${id})" class="btn btn-danger">Delete</button>
//                               </div>`;
//   }
// }
// fetchIssues();

// const fetchIssues = () => {
//   const issues = JSON.parse(localStorage.getItem('issues'));
//   const issuesList = document.getElementById('issuesList');
//   issuesList.innerHTML = '';

//   for (var i = 0; i < issues.length; i++) {
//     const { id, description, severity, assignedTo, status } = issues[i];

//     issuesList.innerHTML += `<div class="well">
//                               <h6>Issue ID: ${id}</h6>
//                               <p><span class="label label-info">${status}</span></p>
//                               <div class="issue-description">${description}</div>
//                               <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
//                               <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
//                               <button onclick="closeIssue(${id})" class="btn btn-warning">Close</button>
//                               <button onclick="deleteIssue(${id})" class="btn btn-danger">Delete</button>
//                             </div>`;
//   }
// }
// fetchIssues();


// Global variables for sorting, filtering, and pagination
let sortBy = 'id'; // Default sorting field
let filterBy = ''; // Default filter value
let currentPage = 1; // Current page number
const issuesPerPage = 5; // Number of issues to display per page

// Function to update the sorting and filtering options
const updateOptions = () => {
  sortBy = document.getElementById('sortOption').value;
  filterBy = document.getElementById('filterOption').value;
  currentPage = 1; // Reset to the first page when options change
  fetchIssues();
};

// Function to handle page navigation
const changePage = (page) => {
  currentPage = page;
  fetchIssues();
};

const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  // Apply sorting and filtering
  const sortedAndFilteredIssues = issues
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
    .filter(issue =>
      issue.description.toLowerCase().includes(filterBy.toLowerCase())
    );

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedAndFilteredIssues.length / issuesPerPage);

  // Calculate the starting and ending indexes for the current page
  const startIndex = (currentPage - 1) * issuesPerPage;
  const endIndex = startIndex + issuesPerPage;

  // Get the issues to display on the current page
  const displayedIssues = sortedAndFilteredIssues.slice(startIndex, endIndex);

  for (var i = 0; i < displayedIssues.length; i++) {
    const {
      id,
      description,
      severity,
      assignedTo,
      status,
      comments,
      attachments
    } = displayedIssues[i];

    // Display the issue details
    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id}</h6>
                              <p><span class="label label-info">${status}</span></p>
                              <h3>${description}</h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <div class="comments">
                                <h4>Comments:</h4>
                                ${comments && comments.length > 0 ? comments.map((comment, index) => `
                                  <div>
                                    <p>${comment}</p>
                                    <button onclick="deleteComment('${id}', ${index})" class="btn btn-danger">Delete Comment</button>
                                  </div>
                                `).join('') : '<p>No comments yet.</p>'}
                              </div>
                              <div class="attachments">
                                <h4>Attachments:</h4>
                                ${attachments && attachments.length > 0 ? attachments.map((attachment, index) => `
                                  <div>
                                    <p>${attachment.name}</p>
                                    <a href="${attachment.data}" download>Download Attachment</a>
                                    <button onclick="deleteAttachment('${id}', ${index})" class="btn btn-danger">Delete Attachment</button>
                                  </div>
                                `).join('') : '<p>No attachments yet.</p>'}
                              </div>
                              <div class="comment-input">
                                <input type="text" id="commentInput_${id}" placeholder="Add a comment...">
                                <button onclick="addComment('${id}')" class="btn btn-primary">Add Comment</button>
                              </div>
                              <div class="attachment-input">
                                <input type="file" id="attachmentInput_${id}">
                                <button onclick="addAttachment('${id}')" class="btn btn-primary">Add Attachment</button>
                              </div>
                              <button onclick="closeIssue('${id}')" class="btn btn-warning">Close</button>
                              <button onclick="deleteIssue('${id}')" class="btn btn-danger">Delete</button>
                            </div>`;
  }

  // Generate pagination navigation buttons
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const isActive = currentPage === i ? 'active' : '';
    pagination.innerHTML += `<li class="${isActive}"><a href="#" onclick="changePage(${i})">${i}</a></li>`;
  }

  // Disable previous/next buttons based on current page
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  if (currentPage === 1) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (currentPage === totalPages) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
};

// Function to go to the previous page
const goToPrevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    fetchIssues();
  }
};

// Function to go to the next page
const goToNextPage = () => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const sortedAndFilteredIssues = issues
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
    .filter(issue =>
      issue.description.toLowerCase().includes(filterBy.toLowerCase())
    );

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedAndFilteredIssues.length / issuesPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    fetchIssues();
  }
};

fetchIssues();

// Function to handle logout
const handleLogout = () => {
  // Perform any necessary logout operations

  // Redirect to the login page
  window.location.href = 'login.html';
};

// Add event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', handleLogout);
