
// Awaited 解包promise
type A = Awaited<Promise<string>>;


// Partial 构造一个类型，其中type的所有属性都设置为可选
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = {
  description: "throw out trash",
};
 
const todo3 = updateTodo(todo1, todo2);

// Required 构造一个类型，该类型设置为传入类型的所有属性
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
 
// const obj2: Required<Props> = { a: 5 };

// Record<Keys, Type>
// 构造一个对象类型，其属性键为Keys，属性值为type
type CatName = "miffy" | "boris" | "mordred";
 
interface CatInfo {
  age: number;
  breed: string;
}
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
 
cats.boris;


// Pick<Type, Keys>
// 构建一个类型，该类型为Type上面所有的key对应的属性值


// omit<type, Keys>
// 构建类型，获取type上除keys的所有属性

// exclude<UnionType, ExcludeMembers>
// 从Union类型上，排除掉Exclude类型






