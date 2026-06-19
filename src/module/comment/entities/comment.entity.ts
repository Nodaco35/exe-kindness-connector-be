import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true })
  bookId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  content!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
