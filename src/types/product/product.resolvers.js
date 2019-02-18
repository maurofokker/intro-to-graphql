import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

// resolvers follow the same name as schema definition of Product in this case
// you can watch parameters and names

// query resolvers

const product = (_, args, ctx, info) => {
  return Product.findById(args.id)
    .lean()
    .exec()
}

const products = (_, args, ctx, info) => {
  return Product.find({}).exec()
}

// mutation resolvers
// remember watch parameters in Mutation they match with used in args

const newProduct = (_, args, ctx, info) => {
  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const updateProduct = (_, args, ctx, info) => {
  const update = args.input
  return Product.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx, info) => {
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {  // bc every query/mutation that run before this returns a Product object
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
