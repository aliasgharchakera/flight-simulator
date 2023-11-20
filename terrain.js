var x_resolution = 100; var z_resolution = 100;

const getPatch = (xmin,xmax,zmin,zmax) => {
    console.log('xmax hai',xmax)
    var x = xmax-xmin
    var z = zmax-zmin
    let step_x = Number((x/x_resolution).toFixed(2))
    console.log('step hai',step_x)
    let step_z = Number((z/z_resolution).toFixed(2))
    // console.log(step_x)
    // let step_x = 20
    // let step_z = 20
    var vertices = []
    var indices = []
    var normals = []
    var v = []
    var offset = 0.05
    var x_off = xmin/10; 
    let currentVertex = 0

    if(viewType===2){
        console.log('calling this one')
        for(var i=xmin;i<xmax;i+=step_x){
            console.log('inside x loop')
            var z_off = zmin/10
            for(var j=zmin;j<zmax;j+=step_z){
                const y = getHeight(x_off, z_off)
                // console.log('got height')
                vertices.push(vec4(i,y,j,1))
                console.log('pushed vertex for',i,j)
                z_off+=offset
            }
            console.log('done with the loop')
            x_off+=offset
            return [vertices,normals]
        }
    }else{
        for(var i=xmin;i<xmax;i+=step_x){
            var z_off = zmin/10
            for(var j=zmin;j<zmax;j+=step_z){
                const y = getHeight(x_off, z_off)
                const pos = vec4(i,y, j,1)
                //calculate normal here
                // const normal = vec3(0,1,0)

                vertices.push(pos)
                if(currentVertex%z_resolution!==z_resolution-1 && currentVertex<((x_resolution*z_resolution)-x_resolution)){
                    indices.push(currentVertex)
                    indices.push(currentVertex+1)
                    indices.push(currentVertex+x_resolution)
                    indices.push(currentVertex+1)
                    indices.push(currentVertex+x_resolution+1)
                    indices.push(currentVertex+x_resolution)
                }

                currentVertex++
                z_off+=offset
            }
            x_off+=offset
        }

        var indexed_vertices = []
        var v_1;var v_2;var v_3;
        for(var i=0;i<indices.length;i++){
            indexed_vertices.push(vertices[indices[i]])
            if(i%3===0){
                v_1 = vertices[indices[i]]
            }else if(i%3===1){
                v_2 = vertices[indices[i]]
            }else{
                v_3 = vertices[indices[i]]
                var normal = normalize(cross(subtract(v_1,v_2),subtract(v_1,v_3)))
                normals.push(normal)
                normals.push(normal)
                normals.push(normal)
            }
        }
        return [indexed_vertices,normals]
    }
    
}

const getHeight = (x, z) => {
    var value = perlin.get(x,z) * 1700;
    return value
}

