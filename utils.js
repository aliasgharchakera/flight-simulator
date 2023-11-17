let shift = false;

const handleKeyDown = (e) => {
    if (e.keyCode == 16)
    {
        shift = true;
    }
    if (e.keyCode == 49) {
        //if 1 pressed vary left
        if (shift == true)
        {
            left_ += 0.01;
            right_ += 0.01;
        }
    } else if (e.keyCode == 50) {
        // if 2 pressed vary right
        if (shift == true)
        {
            right_ -= 0.01;
            left_ -= 0.01;
        }
    } else if (e.keyCode == 51) {
        //if 3 pressed vary top
        if (shift == true)
        {
            bottom_ -= 0.01;
        }
        // bottom_ -= 0.01;
    } else if (e.keyCode == 52) {
        //if 4 pressed vary bottom
        if(shift == true)
        {
            bottom_ += 0.01;
            // shift = false;
        }
        // bottom_ += 0.01;
    } else if (e.keyCode == 53) {
        //if 5 pressed vary near
        if (shift == true)
        {
            near_ += 0.01;
            // shift = false;
        }
        // near_ += 0.01;
    } else if (e.keyCode == 54) {
        //if 6 pressed vary far
        if (shift == true)
        {
            far_ += 0.01;
            // shift = false;
        }
        // far_ += 0.01;
    } else if (e.keyCode == 27) {
        //esc
        //quit
        points = [];
        zMin = zMax = xMax = xMin = 0;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        Escape = true;
        gl.drawArrays(gl.TRIANGLES, 0, points.length); //Rendering the triangle
    } else if (e.key == "W" || e.key == "w") {
        // change  pitch
        pitch = Math.max(pitch - 1, -90);
    } else if (e.key == "S" || e.key == "s") {
        // change  pitch
        pitch = Math.min(pitch + 1, 45);
    } else if (e.key == "D" || e.key == "d") {
        // change yaw
        yaw = Math.max(yaw - 1, -90);
    } else if (e.key == "A" || e.key == "a") {
        // change yaw
        yaw = Math.min(yaw + 1, 90);
    } else if (e.key == "Q" || e.key == "q") {
        // change roll and viewing volume accordingly
        roll = Math.max(roll - 1, -90);
        if (roll > -90 && roll <= 0) {
            left_ -= 0.01;
            right_ += 0.01;
        } else if (roll > 0) {
            left_ += 0.01;
            right_ -= 0.01;
        }
    } else if (e.key == "E" || e.key == "e") {
        // change roll and viewing volume accordingly
        roll = Math.min(roll + 1, 90);
        if (roll <= 0) {
            left_ += 0.01;
            right_ -= 0.01;
        } else if (roll > 0 && roll < 90) {
            left_ -= 0.01;
            right_ += 0.01;
        }
    } else if (e.keyCode == 38) {
        // Increases speed to a limit of 10
        if (stopped) stopped = false;
        else speed = Math.min(10, speed + 1);
    } else if (e.keyCode == 40) {
        // Decreases speed to 1, then stops the camera
        if (speed > 1) speed = speed - 1;
        else stopped = true;
    } else if (e.key == "T" || e.key == "t") {
        // Used to toggle collisions
        if (collision_enabled) stopped = false;
        collision_enabled = !collision_enabled;
    } else if (e.key == "C" || e.key == "c") {
        if (colorScheme == 2) colorScheme = 0;
        else colorScheme++;
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
const move_camera_pitch = () =>
    (eye[1] = Math.min(Math.max(eye[1] + at_vec[1] * 50, 1000), 2000));

const getAvg = (v1, v2, v3) =>
    vec3((v1[0] + v2[0] + v3[0]) / 3,(v1[1] + v2[1] + v3[1]) / 3,(v1[2] + v2[2] + v3[2]) / 3);
