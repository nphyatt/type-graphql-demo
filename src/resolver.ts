import { Resolver, Query, ClassType, Arg, Int, ObjectType, Field } from 'type-graphql';
import { GraphQLString } from 'graphql';
import 'reflect-metadata';


function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected items: InstanceType<T>[] = [];

    @Query(() => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(@Arg("first", () => Int) first: number): Promise<T[]> {
      return this.items.slice(0, first);
    }
  }

  return BaseResolver;
}

@ObjectType()
class Person {

  @Field({ nullable: false })
  name!: string;

  @Field(() => Int, { nullable: false })
  age!: number;
}

const PersonBaseResolver = createBaseResolver("persons", Person);

@Resolver(() => Person)
export class PersonResolver extends PersonBaseResolver {
  items = [{ name: 'Bob', age: 34 }, { name: 'Jill', age: 25 }];

  @Query(() => Int, { nullable: true })
  getAge(@Arg("name") name: string) {
    const person = this.items.find(person => person.name === name);
    return person && person.age;
  }
}

@ObjectType()
class Dog {

  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: false })
  breed!: string;
}

const DogBaseResolver = createBaseResolver("dogs", Dog);

@Resolver(() => Person)
export class DogResolver extends DogBaseResolver {
  items = [{ name: 'Fido', breed: 'Golden Retriever' }, { name: 'BowWow', breed: 'Great Dane' }];
  @Query(() => GraphQLString, { nullable: true })
  getBreed(@Arg("name") name: string) {
    const dog = this.items.find(dog => dog.name === name);
    return dog && dog.breed;
  }
}