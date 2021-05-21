/**
 * @param {Object[]} courses - The required courses for student to graduate.
 * @param {string} courses[].name - The name of the course.
 * @param {string} courses[].prerequisites - Courses needed to be taken before eligible to attend current.
 */
var printSchedule = function(courses) {
    const visited = Array(courses.length).fill(0);
    const graph = new Map();
    const order = [];
    const queue = [];

    // Build graph with prerequisites for courses
    // O(n * m) : n = number of courses, m = number of prerequisites
    for (const [index, course] of courses.entries()) {
        visited[index] = course.prerequisites.length;
        for (let j = 0; j < course.prerequisites.length; j++) {
            let prereq = course.prerequisites[j];
            if (graph.has(prereq)) {
                graph.get(prereq).push(index);
            } else {
                graph.set(prereq, [index]);
            }
        }
    }

    // Add courses without prerequisites to beginning of queue
    // O(n) : number of courses
    for (let i = 0; i < visited.length; i++) {
        if (visited[i] == 0) queue.push(i);
    }

    // Sort courses based on prerequisites
    // O(n) : number of courses
    while (queue.length) {
        let index = queue.shift();
        let courseName = courses[index].name;
        // if course is a prerequisite
        if (graph.has(courseName)) {
            // get all courses where current is a prerequisite
            for (let prereqToThisCourseIndex of graph.get(courseName)) {
                visited[prereqToThisCourseIndex]--;
                // prerequisites have been met
                if (visited[prereqToThisCourseIndex] === 0) {
                    queue.push(prereqToThisCourseIndex);
                }
            }
        }
        order.push(index);
    }


    // Print course names in prerequisite-satisfying order
    // O(n) : number of courses
    for (let i = 0; i < order.length; i++) {
        console.log(courses[order[i]].name);
    }
}

var start = function() {
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