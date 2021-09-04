import Transformable from "../Transformable.js";

export default class Triangle extends Transformable {
    color = '#0f0';

    constructor(position, size) {
        super();
        this.position = position;
        this.size = size;
    }

    Draw(ctx){
        this.points = [
            new Vector2(0, 0 - this.size.Y * this.scale.Y / 2),
            new Vector2(0 + this.size.X * this.scale.X / 2, 0 + this.size.Y * this.scale.Y / 2),
            new Vector2(0 - this.size.X * this.scale.X / 2, 0 + this.size.Y * this.scale.Y / 2)
        ]
        this.path = new Path2D();
        for (let i = 0; i < this.points.length; i++) {
            if(i == 0){
                this.path.moveTo(this.points[i].X, this.points[i].Y)
            }
            else{
                this.path.lineTo(this.points[i].X, this.points[i].Y)
            }
        }
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.position.X + this.size.X * this.scale.X / 2, this.position.Y + this.size.Y * this.scale.Y / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fill(this.path);
        ctx.restore();
    }

    IsPointColliding(point){
        let ctx = document.createElement('canvas').getContext('2d')
        ctx.translate(this.position.X + this.size.X * this.scale.X / 2, this.position.Y + this.size.Y * this.scale.Y / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        for (let i = 0; i < this.points.length; i++) {
            if(i == 0){
                ctx.moveTo(this.points[i].X, this.points[i].Y)
            }
            else{
                ctx.lineTo(this.points[i].X, this.points[i].Y)
            }
        }
        return ctx.isPointInPath(point.X, point.Y);
    }
}