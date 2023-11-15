const get_patch = (xmin,xmax,zmin,zmax) => {
    x = xmax-xmin
    z = zmax-zmin
    x_resolution = 100;z_resolution = 100
    step_x = x/x_resolution.toFixed(2)
    step_z = z/z_resolution.toFixed(2)
    vertices = []
    indices = []

    currentVertex = 0
    for(var i=xmin;i<xmax;i+=step_x){
        for(var j=zmin;j<zmax;j+=step_z){
            // console.log(j)
            const pos = vec3(i,0,j)
            //calculate normal here
            // const normal = vec3(0,1,0)

            vertices.push(pos)
            if(currentVertex%z_resolution!==z_resolution-1){
                indices.push(currentVertex)
                indices.push(currentVertex+1)
                indices.push(currentVertex+x_resolution)
                indices.push(currentVertex+1)
                indices.push(currentVertex+x_resolution+1)
                indices.push(currentVertex+x_resolution)
            }

            currentVertex++
        }
    }
    // console.log(vertices)
    // console.log(indices)
}

get_patch(0,1,0,1)