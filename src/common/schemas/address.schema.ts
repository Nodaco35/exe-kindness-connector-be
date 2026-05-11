import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ _id: false})
export class Address {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    })
    city! : mongoose.Types.ObjectId 

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    })
    district! : mongoose.Types.ObjectId 
}
export const AddressSchema = SchemaFactory.createForClass(Address)