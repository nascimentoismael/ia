var gridsize = 4;
var grid = [];
for(let i  = 0; i<gridsize; i++){
    grid[i]=[];
    for(let j = 0;j<gridsize;j++){
        grid[i][j]="vazio";
    }
}

grid[0][0]="inicio";
grid[2][2]="objetivo";
grid[1][1]="obstaculo";
grid[1][2]="obstaculo";
grid[1][3]="obstaculo";
grid[2][1]="obstaculo";

console.log(grid);

function findShortestpath(startCoordinates, grid){
    let line = startCoordinates.top;
    let column = startCoordinates.left;

    let location = {
        distanceFromTop: line,
        distanceFromLeft: column,
        path: [],
        status: "inicio"
    }

    let queue = [location];

    while (queue.length > 0) {
        let currentLocation = queue.shift();

/*        ["Norte","Leste","Sul","Oeste"].foreach(direction =>{

        })
*/

        let newLocation = exploreInDirection(currentLocation,"Norte",grid);
        if(newLocation.status === "objetivo"){
            return newLocation.path;
        }else if(newLocation.status === "valido"){
            queue.push(newLocation);
        }
        
        newLocation = exploreInDirection(currentLocation,"Leste",grid);
        if(newLocation.status === "objetivo"){
            return newLocation.path;
        }else if(newLocation.status === "valido"){
            queue.push(newLocation);
        }

        newLocation = exploreInDirection(currentLocation,"Sul",grid);
        if(newLocation.status === "objetivo"){
            return newLocation.path;
        }else if(newLocation.status === "valido"){
            queue.push(newLocation);
        }

        newLocation = exploreInDirection(currentLocation,"Oeste",grid);
        if(newLocation.status === "objetivo"){
            return newLocation.path;
        }else if(newLocation.status === "valido"){
            queue.push(newLocation);
        }
    }
    return false;
}

function locationStatus(location, grid){
    const gridsize = grid.length;
    let dft = location.distanceFromTop;
    let dfl = location.distanceFromLeft;

    if(dfl<0||dfl>=gridsize||dft<0||dft>=gridsize)
        return 'invalida';
    else if(grid[dft][dfl] === 'objetivo')
        return "objetivo";
    else if(grid[dft][dfl] !== 'vazio')
        return "bloqueada";
    else
        return 'valido';
}

function exploreInDirection(currentLocation,direction,grid){
    let newPath = currentLocation.path.slice();
    newPath.push(direction);

    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;

    if (direction === "Norte")
        dft -=1;
    else if (direction === "Leste")
        dfl += 1;
    else if (direction === "Sul") 
        dft +=1;
    else if (direction === "Oeste")
        dfl -= 1;

    let newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: [],
        status: "desconhecido"
    }

    newLocation.status = locationStatus(newLocation,grid);

    if (newLocation.status === "valida") {
        grid[dft][dfl] = "visitada";
    }
    return newLocation;
}

findShortestpath({top:0,left:0},grid);