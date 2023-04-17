/**
 * @param {Object[]} courses - The required courses for student to graduate.
 * @param {string} courses[].name - The name of the course.
 * @param {string} courses[].prerequisites - Courses needed to be taken before eligible to attend current.
 */
const printSchedule = function (courses) {
    const graph = new Map();
    const indegrees = new Map();
    const order = [];

    // Initialize the graph and indegrees for performing a topological sort on the courses.
    // O(n) : n = number of courses
    for (const course of courses) {
        graph.set(course.name, []);
        indegrees.set(course.name, 0);
    }

    // For each requirement a course has, it looks up that course in a list and adds the name of
    // the current course to that list. It also looks up the current course in a counter and adds
    // 1 to the count of courses that require it as a prerequisite.
    //  O(n * m) : n = number of courses, m = max number of prerequisites for a single course
    for (const course of courses) {
        for (const prereq of course.prerequisites) {
            graph.get(prereq).push(course.name);
            indegrees.set(course.name, indegrees.get(course.name) + 1);
        }
    }

    // Find courses with no prerequisites to the beginning of the queue
    // O(n) : number of courses in the indegrees map
    const queue = [];
    for (const [course, indegree] of indegrees) {
        if (indegree === 0) queue.push(course);
    }

    // BFS starting with courses with no prerequisites
    // O(n + e) : n = number of courses, e = total number of prerequisite dependencies between courses
    while (queue.length > 0) {
        const course = queue.shift();
        order.push(course);
        for (const neighbor of graph.get(course)) {
            indegrees.set(neighbor, indegrees.get(neighbor) - 1);
            if (indegrees.get(neighbor) === 0) queue.push(neighbor);
        }
    }

    // Print course names in prerequisite-satisfying order
    // O(n) : number of courses
    for (const course of order) {
        console.log(course);
    }
}

const start = function () {
    if (process.argv.length <= 2) {
        console.log("Error: No argument provided.");
    } else {
        // parse JSON file
        const courses = require('./' + process.argv[2])
        // base case
        if (courses.length === 0) {
            console.log("Error: No classes provided in file.");
        } else {
            printSchedule(courses);
        }
    }
};

start();
