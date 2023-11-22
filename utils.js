const handleKeyDown = (e) => {
    const key = e.key;
    switch (key) {
        case "1":
            if(left_>leftBound[0]){
                leftValue.style.backgroundColor = "white"
                left_ -= 0.1;
                if(left_<=leftBound[0]){
                    left_ = leftBound[0]
                    leftValue.style.backgroundColor = "red"
                }
                leftValue.innerHTML = left_
            }
            break
        case "!":
            if(left_<leftBound[1]){
                leftValue.style.backgroundColor = "white"
                left_ += 0.1;
                if(left_>=leftBound[1]){
                    left_ = leftBound[1]
                    leftValue.style.backgroundColor = "red"
                }
                leftValue.innerHTML = left_;
            }
            // right_ += 0.01;
            break;
        case "2":
            if(right_<rightBound[1]){
                rightValue.style.backgroundColor = "white"
                right_ += 0.1;
                if(right_>=rightBound[1]){
                    right_ = rightBound[1]
                    rightValue.style.backgroundColor = "red"
                }
                rightValue.innerHTML = right_;
            }
            break
        case "@":
            if(right_>rightBound[0]){
                rightValue.style.backgroundColor = "white"
                right_ -= 0.1;
                if(right_<=rightBound[0]){
                    right_ = rightBound[0]
                    rightValue.style.backgroundColor = "red"
                }
                rightValue.innerHTML = right_;
            }
            // left_ -= 0.01;
            break;
        case "3":
            if(top_>topBound[0]){
                topValue.style.backgroundColor = "white"
                top_ -= 0.1;
                if(top_<=topBound[0]){
                    top_ = topBound[0]
                    topValue.style.backgroundColor = "red"
                }
                topValue.innerHTML = top_;
            }
            break
        case "#":
            if(top_<topBound[1]){
                topValue.style.backgroundColor = "white"
                top_ += 0.1;
                if(top_>=topBound[1]){
                    top_ = topBound[1]
                    topValue.style.backgroundColor = "red"
                }
                topValue.innerHTML = top_;
            }
            break;
        case "4":
            if(bottom_>bottomBound[0]){
                bottomValue.style.backgroundColor = "white"
                bottom_ -= 0.1;
                if(bottom_<=bottomBound[0]){
                    bottom_ = bottomBound[0]
                    bottomValue.style.backgroundColor = "red"
                }
                bottomValue.innerHTML = bottom_;
            }
            break
        case "$":
            if(bottom_<bottomBound[1]){
                bottomValue.style.backgroundColor = "white"
                bottom_ += 0.1;
                if(bottom_>=bottomBound[1]){
                    bottom_ = bottomBound[1]
                    bottomValue.style.backgroundColor = "red"
                }
                bottomValue.innerHTML = bottom_;
            }
            break;
        case "5":
            if(near_>nearBound[0]){
                nearValue.style.backgroundColor = "white"
                near_ -= 0.01;
                if(near_<=nearBound[0]){
                    near_ = nearBound[0]
                    nearValue.style.backgroundColor = "red"
                }
                nearValue.innerHTML = near_;
            }
            break
        case "%":
            if(near_<nearBound[1]){
                nearValue.style.backgroundColor = "white"
                near_ += 0.01;
                if(near_>=nearBound[1]){
                    near_ = nearBound[1]
                    nearValue.style.backgroundColor = "red"
                }
                nearValue.innerHTML = near_;
            }
            break;
        case "6":
            if(far_>farBound[0]){
                farValue.style.backgroundColor = "white"
                far_ -= 0.01;
                if(far_<=farBound[0]){
                    far_ = farBound[0]
                    farValue.style.backgroundColor = "red"
                }
                farValue.innerHTML = far_;
            }
            break
        case "^":
            if(far_<farBound[1]){
                farValue.style.backgroundColor = "white"
                far_ += 0.01;
                if(far_>=farBound[1]){
                    far_ = farBound[1]
                    farValue.style.backgroundColor = "red"
                }
                farValue.innerHTML = far_;
            }
            break;
        case "r":
        case "R":
            // Reset all values to default
            eye = vec3(1200, 1200, 300.0);
            at_vec = vec3(0.0, 0.0, 300.0);
            at = add(eye, at_vec);
            up = vec3(0.0, 1.0, 0.0);

            left_ = -0.1;
            leftValue.innerHTML = left_;
            leftValue.style.backgroundColor = "white"
            right_ = 0.1;
            rightValue.innerHTML = right_;
            rightValue.style.backgroundColor = "white"
            bottom_ = -0.5;
            bottomValue.innerHTML = bottom_;
            bottomValue.style.backgroundColor = "white"
            top_ = 1.5;
            topValue.innerHTML = top_;
            topValue.style.backgroundColor = "white"
            near_ = 0.1;
            nearValue.innerHTML = near_;
            nearValue.style.backgroundColor = "white"
            far_ = -0.1;
            farValue.innerHTML = far_;
            farValue.style.backgroundColor = "white"
            break;
        case "Escape":
            points = [];
            // zMin = zMax = xMax = xMin = 0;
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            Escape = !Escape;
            gl.drawArrays(gl.TRIANGLES, 0, 0);
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
            shadingType = (shadingType+1)%3;
            console.log(shadingType);
            break;
        case "v":
        case "V":
            viewType = (viewType+1)%3;
            break;
    }

    window.cancelAnimationFrame(anim);
    anim = window.requestAnimationFrame(render);
};

// this function was from https://gamma.cs.unc.edu/courses/graphics-s09/HW/hw2/
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

function assignColors() {
    let c = [];
    colors = [];

    if(viewType===1){
        for (var i=0;i<points.length;i++){
            let color = vec3(1,1,1)
            c.push(color)
        }
        colors = c;
        // console.log(points)
    }else{
        for (let i = 0; i < points.length; i++) {
            let color = vec3(0,0,0)
            let red = 0.0, green = 0.0, blue = 0.0;
            if (points[i][1] < -200){
                red = 0.18039, green = 0.22353, blue = 0.55686;
                color = vec3(red, green, blue)
            }else if (0.0 < points[i][1] && points[i][1] < 200.0){
                red = 0.588, green = 0.294;
                color = vec3(red, green, blue)
            }else if (points[i][1] > 350.0){
                red = 1.0, green = 1.0, blue = 1.0;
                color = vec3(red, green, blue)
            }else{
                red = 0.24, green = 0.294, blue = 0.08;
                color = vec3(red, green, blue)
            }
            c.push(color);
        }
        if(viewType===2){
            colors = c;
            return;
        }
        for (var i = 0; i < c.length; i += 3) {
            if (shadingType == 0) {
                let avg = getAvg(c[i], c[i + 1], c[i + 2]);
                colors.push(avg);
                colors.push(avg);
                colors.push(avg);
            }
            else{
                colors.push(c[i]);
                colors.push(c[i + 1]);
                colors.push(c[i + 2]);
            }
        }
    }
};