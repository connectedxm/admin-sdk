declare module "comment-parser" {
  interface Tag {
    tag: string;
    name: string;
    type?: string;
    optional?: boolean;
    default?: string;
    description: string;
    problems: any[];
    source: string[];
  }

  interface ParsedComment {
    description: string;
    tags: Tag[];
  }

  export function parse(source: string): ParsedComment[];
}
