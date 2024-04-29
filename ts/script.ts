document.addEventListener("DOMContentLoaded", (_) => {
  const canvasElement = document.getElementById(
    "myCanvas",
  ) as HTMLCanvasElement;

  const rotationInput = document.getElementById(
    "rotationInput",
  ) as HTMLInputElement;
  const scaleInput = document.getElementById("scaleInput") as HTMLInputElement;
  const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;

  const center = [canvasElement.width / 2, canvasElement.height / 2];

  const vectors = [
    Vector3D.fromArray([-0.5, -0.5, -0.5]),
    Vector3D.fromArray([0.5, -0.5, -0.5]),
    Vector3D.fromArray([0.5, 0.5, -0.5]),
    Vector3D.fromArray([-0.5, 0.5, -0.5]),

    Vector3D.fromArray([-0.5, -0.5, 0.5]),
    Vector3D.fromArray([0.5, -0.5, 0.5]),
    Vector3D.fromArray([0.5, 0.5, 0.5]),
    Vector3D.fromArray([-0.5, 0.5, 0.5]),
  ];

  const projection2D = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  const renderFunction = () => {
    ctx.reset();
    ctx.translate(center[0], center[1]);

    const angle = parseFloat(rotationInput.value);
    const scale = parseInt(scaleInput.value);
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

    const projectedVectorList: Vector3D[] = [];

    let index = 0;
    for (let vector of vectors) {
      let rotationVector = Util3D.multiplyMatricies(rotationX, vector);

      rotationVector = Util3D.multiplyMatricies(rotationY, rotationVector);
      rotationVector = Util3D.multiplyMatricies(rotationZ, rotationVector);

      let projectedVector = Util3D.multiplyMatricies(
        projection2D,
        rotationVector,
      );

      projectedVector = projectedVector.scale(scale);

      projectedVectorList[index] = projectedVector;

      ctx.fillRect(projectedVector.x, projectedVector.y, 4, 4);

      ++index;
    }

    Renderer.drawLineBetween(ctx, projectedVectorList, 0, 1);
    Renderer.drawLineBetween(ctx, projectedVectorList, 1, 2);
    Renderer.drawLineBetween(ctx, projectedVectorList, 2, 3);
    Renderer.drawLineBetween(ctx, projectedVectorList, 3, 0);

    Renderer.drawLineBetween(ctx, projectedVectorList, 4, 5);
    Renderer.drawLineBetween(ctx, projectedVectorList, 5, 6);
    Renderer.drawLineBetween(ctx, projectedVectorList, 6, 7);
    Renderer.drawLineBetween(ctx, projectedVectorList, 7, 4);

    Renderer.drawLineBetween(ctx, projectedVectorList, 0, 4);
    Renderer.drawLineBetween(ctx, projectedVectorList, 1, 5);
    Renderer.drawLineBetween(ctx, projectedVectorList, 2, 6);
    Renderer.drawLineBetween(ctx, projectedVectorList, 3, 7);
  };

  rotationInput.addEventListener("input", renderFunction);
  scaleInput.addEventListener("input", renderFunction);

  renderFunction();
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

  scale(s: number): Vector3D {
    return Vector3D.fromArray([this.x * s, this.y * s, this.z * s]);
  }

  static fromArray(coords: number[]): Vector3D {
    return new Vector3D(coords[Axis.x], coords[Axis.y], coords[Axis.z]);
  }
}

class Renderer {
  static drawLineBetween(
    ctx: CanvasRenderingContext2D,
    vectors: Vector3D[],
    index1: number,
    index2: number,
  ) {
    const vector1 = vectors[index1];
    const vector2 = vectors[index2];
    ctx.beginPath();
    ctx.moveTo(vector1.x, vector1.y);
    ctx.lineTo(vector2.x, vector2.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
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

  static multiplyMatricies(matrix1: number[][], vector: Vector3D): Vector3D {
    const cols1 = matrix1[0].length;
    const rows1 = matrix1.length;

    const matrix2 = Util3D.convertVectorToMatrix(vector);
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
        for (let k = 0; k < cols1; k++) {
          sum += matrix1[i][k] * matrix2[k][j];
        }

        result[i][j] = sum;
      }
    }

    return Util3D.convertMatrixToVector(result);
  }
}

class Point3D {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {}
}
