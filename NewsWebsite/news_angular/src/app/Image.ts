import { Article } from './Article';  // 假设你已经有了这个接口

export interface Image {
  id: number;            // 对应 Java 的 Long 类型
  url: string;           // 对应 Java 的 String 类型
  article: Article;      // 直接引用已经定义的 Article 接口
}
