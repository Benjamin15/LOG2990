const POSITIONY = -19.5;
const WIDTH_X_AND_Z = 45;
const WIDTH_X_OR_Z = 50;
const PLANE_FACTOR = 2;

export class PlaneCreatorService {

    public widthOnXAndZ(array: Array<THREE.Vector3>, plane: THREE.PlaneGeometry, v: number): THREE.PlaneGeometry {
        for (let i = 0; i < plane.vertices.length / PLANE_FACTOR; i++) {
            plane.vertices[PLANE_FACTOR * i].x = array[v].x + WIDTH_X_AND_Z;
            plane.vertices[PLANE_FACTOR * i + 1].x = array[v].x - WIDTH_X_AND_Z;
            plane.vertices[PLANE_FACTOR * i].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i + 1].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i].z = array[v].z - WIDTH_X_AND_Z;
            plane.vertices[PLANE_FACTOR * i + 1].z = array[v].z + WIDTH_X_AND_Z;
            plane.computeVertexNormals();
            plane.computeFaceNormals();
            plane.elementsNeedUpdate = true;
            v++;
            if (v > array.length) {
                v = 0;
            }
        }
        plane.computeFaceNormals();
        return plane;
    }

    public widthOnXAndZDiagonal(array: Array<THREE.Vector3>, plane: THREE.PlaneGeometry, v: number): THREE.PlaneGeometry {
        for (let i = 0; i < plane.vertices.length / PLANE_FACTOR; i++) {
            plane.vertices[PLANE_FACTOR * i].x = array[v].x + WIDTH_X_AND_Z;
            plane.vertices[PLANE_FACTOR * i + 1].x = array[v].x - WIDTH_X_AND_Z;
            plane.vertices[PLANE_FACTOR * i].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i + 1].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i].z = array[v].z + WIDTH_X_AND_Z;
            plane.vertices[PLANE_FACTOR * i + 1].z = array[v].z - WIDTH_X_AND_Z;
            plane.computeVertexNormals();
            plane.computeFaceNormals();
            plane.elementsNeedUpdate = true;
            v++;
            if (v > array.length) {
                v = 0;
            }
        }
        return plane;
    }

    public widthOnZ(array: Array<THREE.Vector3>, plane: THREE.PlaneGeometry, v: number): THREE.PlaneGeometry {
        for (let i = 0; i < plane.vertices.length / PLANE_FACTOR; i++) {
            plane.vertices[PLANE_FACTOR * i].x = array[v].x;
            plane.vertices[PLANE_FACTOR * i + 1].x = array[v].x;
            plane.vertices[PLANE_FACTOR * i].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i + 1].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i].z = array[v].z - WIDTH_X_OR_Z;
            plane.vertices[PLANE_FACTOR * i + 1].z = array[v].z + WIDTH_X_OR_Z;
            plane.computeVertexNormals();
            plane.computeFaceNormals();
            plane.elementsNeedUpdate = true;
            v++;
            if (v > array.length) {
                v = 0;
            }
        }
        return plane;
    }

    public widthOnX(array: Array<THREE.Vector3>, plane: THREE.PlaneGeometry, v: number): THREE.PlaneGeometry {
        for (let i = 0; i < plane.vertices.length / PLANE_FACTOR; i++) {
            plane.vertices[PLANE_FACTOR * i].x = array[v].x - WIDTH_X_OR_Z;
            plane.vertices[PLANE_FACTOR * i + 1].x = array[v].x + WIDTH_X_OR_Z;
            plane.vertices[PLANE_FACTOR * i].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i + 1].y = POSITIONY;
            plane.vertices[PLANE_FACTOR * i].z = array[v].z;
            plane.vertices[PLANE_FACTOR * i + 1].z = array[v].z;
            plane.computeVertexNormals();
            plane.computeFaceNormals();
            plane.elementsNeedUpdate = true;
            v++;
            if (v > array.length) {
                v = 0;
            }
        }
        return plane;
    }
}
