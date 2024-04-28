document.addEventListener("DOMContentLoaded", (_) => {
  const canvasElement = document.getElementById(
    "myCanvas",
  ) as HTMLCanvasElement;
  const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;

  const center = [canvasElement.width / 2, canvasElement.height / 2];

  const vectors = [
    Vector3D.fromArray([-50, -50, 15]),
    Vector3D.fromArray([-50, 50, 15]),
    Vector3D.fromArray([50, -50, 15]),
    Vector3D.fromArray([50, 50, 15]),
  ];

  const projection2D = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  const angle = 45;
  const rotationX = [
    [1, 0, 0],
    [0, Math.cos(angle), -Math.sin(angle)],
    [0, Math.sin(angle), Math.cos(angle)],
  ];
  const rotationY = [
    [Math.cos(angle), 0, -Math.sin(angle)],
    [0, 1, 0],
    [-Math.sin(angle), 0, Math.cos(angle)],
  ];
  const rotationZ = [
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1],
  ];

  for (let vector of vectors) {
    const projectedCoords = Util3D.multiplyMatricies(
      projection2D,
      Util3D.convertVectorToMatrix(vector),
    );
    const rotationCoords = Util3D.multiplyMatricies(
      rotationX,
      Util3D.convertVectorToMatrix(
        Util3D.convertMatrixToVector(projectedCoords),
      ),
    );
    const modifiedVector = Util3D.convertMatrixToVector(rotationCoords);

    ctx.fillRect(
      center[0] + modifiedVector.x,
      center[1] + modifiedVector.y,
      2,
      2,
    );
  }
});

enum Axis {
  x = 0,
  y = 1,
  z = 2,
}

class Vector3D {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {}

  static fromArray(coords: number[]): Vector3D {
    return new Vector3D(coords[Axis.x], coords[Axis.y], coords[Axis.z]);
  }
}

class Util3D {
  static convertVectorToMatrix(vector: Vector3D): number[][] {
    return [[vector.x], [vector.y], [vector.z]];
  }

  static convertMatrixToVector(matrix: number[][]): Vector3D {
    return new Vector3D(
      matrix[0][0],
      matrix[1][0],
      matrix[2] ? matrix[2][0] : 0,
    );
  }

  static multiplyMatricies(
    matrix1: number[][],
    matrix2: number[][],
  ): number[][] {
    const cols1 = matrix1[0].length;
    const rows1 = matrix1.length;
    const cols2 = matrix2[0].length;
    const rows2 = matrix2.length;

    if (cols1 !== rows2) {
      throw "cols1 must be equals to rows2";
    }

    const result: number[][] = [];
    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols2; j++) {
        let sum = 0;
        if (result[i] === undefined) {
          result[i] = [];
        }
        for (let k = 0; k < rows2; k++) {
          sum += matrix1[i][k] * matrix2[k][j];
        }

        result[i][j] = sum;
      }
    }

    return result;
  }
}

class Point3D {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {}

  static makeFromCoords(coords: number[]) {
    if (coords.length !== 3) {
      throw `Coords must be an array with 3 element`;
    }

    return new Point3D(coords[0], coords[1], coords[2]);
  }
}
