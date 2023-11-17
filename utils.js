let shift = false;

const handleKeyDown = (e) => {
    const key = e.key;
    switch (key) {
        case "Shift":
            shift = true;
            break;
        case "1":
            if (shift) {
                left_ += 0.01;
                right_ += 0.01;
            }
            break;
        case "2":
            if (shift) {
                right_ -= 0.01;
                left_ -= 0.01;
            }
            break;
        case "3":
            if (shift) {
                bottom_ += 0.01;
            }
            break;
        case "4":
            if (shift) {
                bottom_ -= 0.01;
            }
            break;
        case "5":
            if (shift) {
                near_ += 0.01;
            }
            break;
        case "6":
            if (shift) {
                near_ = Math.max(near_ - 0.01, 0.01);
            }
            break;
        case "r":
        case "R":
            // Reset all values to default
            shift = false;
            eye = vec3(1200, 1200, 300.0);
            at_vec = vec3(0.0, 0.0, 300.0);
            at = add(eye, at_vec);
            up = vec3(0.0, 1.0, 0.0);

            left_ = -0.1;
            right_ = 0.1;
            bottom_ = -0.5;
            top_ = 1.5;
            near_ = 0.1;
            far_ = -0.1;
            break;
        case "Escape":
            points = [];
            zMin = zMax = xMax = xMin = 0;
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            Escape = true;
            gl.drawArrays(gl.TRIANGLES, 0, points.length);
            break;
        case "w":
        case "W":
            pitch = Math.max(pitch - 1, -90);
            break;
        case "s":
        case "S":
            pitch = Math.min(pitch + 1, 45);
            break;
        case "d":
        case "D":
            yaw = Math.max(yaw - 1, -90);
            break;
        case "a":
        case "A":
            yaw = Math.min(yaw + 1, 90);
            break;
        case "q":
        case "Q":
            roll = Math.max(roll - 1, -90);
            if (roll > -90 && roll <= 0) {
                left_ -= 0.01;
                right_ += 0.01;
            } else if (roll > 0) {
                left_ += 0.01;
                right_ -= 0.01;
            }
            break;
        case "e":
        case "E":
            roll = Math.min(roll + 1, 90);
            if (roll <= 0) {
                left_ += 0.01;
                right_ -= 0.01;
            } else if (roll > 0 && roll < 90) {
                left_ -= 0.01;
                right_ += 0.01;
            }
            break;
        case "ArrowUp":
            if (stopped) {
                stopped = false;
            } else if (speed > 5) {
                // do nothing
            } else {
                speed += 0.2;
            }
            break;
        case "ArrowDown":
            if (speed > 0.5) {
                speed -= 0.2;
            } else {
                stopped = true;
            }
            break;
        case "c":
        case "C":
            if (colorScheme == 2) {
                colorScheme = 0;
            } else {
                colorScheme++;
            }
            break;
    }

    window.cancelAnimationFrame(anim);
    anim = window.requestAnimationFrame(render);
};

const handleKeyUp = (event) => {
    if (event.keyCode == 16) {
        shift = false;
        console.log("Shift unPressed");
    }
};


const frustum = (left, right, bottom, top, near, far) => {
    if (left == right) throw "frustum(): left and right are equal";
    if (bottom == top) throw "frustum(): bottom and top are equal";
    if (near == far) throw "frustum(): near and far are equal";

    const width = right - left
    const height = top - bottom
    const depth = far - near

    let result = mat4(
        (2.0 * near) / width, 0.0, (right + left) / width, 0.0,
        0.0, (2.0 * near) / height, (top + bottom) / height, 0.0,
        0.0, 0.0, -(far + near) / depth, (-2.0 * far * near) / depth,
        0.0, 0.0, -1, 0.0
    );

    return result;
};

// Changes the Y coordinate of the camera accordingly
const adjustCameraPitch = () =>
    (eye[1] = Math.min(Math.max(eye[1] + at_vec[1] * 50, 1000), 2000));

const getAvg = (v1, v2, v3) =>
    vec3((v1[0] + v2[0] + v3[0]) / 3,(v1[1] + v2[1] + v3[1]) / 3,(v1[2] + v2[2] + v3[2]) / 3);
