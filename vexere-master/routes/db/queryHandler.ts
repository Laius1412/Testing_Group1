const singleQueryHandler = (queue: string | string[] | undefined) => {
  if (!queue) {
    return "";
  }

  if (typeof queue === "string") {
    return queue
  }

  if (Array.isArray(queue)) {
    return ((queue.length > 0) ? queue[0] : "");
  }

  return "";
}

const arrayQueryHandler = (queue: string | string[] | undefined): string[] => {
  const empty: string[] = []
  if (!queue) {
    return empty;
  }

  if (typeof queue === "string") {
    return [queue]
  }

  if (Array.isArray(queue)) {
    return queue;
  }

  return empty;
}

const singleIntQueryHandler = (queue: string | string[] | undefined, defaultValue: number = 0): number => {
  
  if(typeof queue === "number"){
    return queue
  }

  const query = Number.parseInt(singleQueryHandler(queue));
  return (isNaN(query)) ? defaultValue : query;
}

const arrayIntQueryHandler = (queue: string | string[] | undefined): number[] => {
  const arr:number[] = [];
  const query = arrayQueryHandler(queue);
  query.forEach((value)=>{
    const num = Number.parseInt(value);
    if(!isNaN(num)){
      arr.push(num);
    }
  })
  return arr;
}

const singleFloatQueryHandler = (queue: string | string[] | undefined, defaultValue: number = 0): number => {
  const query = Number.parseFloat(singleQueryHandler(queue));
  return (isNaN(query)) ? defaultValue : query;
}

const arrayFloatQueryHandler = (queue: string | string[] | undefined): number[] => {
  const arr:number[] = [];
  const query = arrayQueryHandler(queue);
  query.forEach((value)=>{
    const num = Number.parseFloat(value);
    if(!isNaN(num)){
      arr.push(num);
    }
  })
  return arr;
}


export {
  singleQueryHandler,
  arrayQueryHandler,
  singleIntQueryHandler,
  arrayIntQueryHandler,
  singleFloatQueryHandler,
  arrayFloatQueryHandler
}