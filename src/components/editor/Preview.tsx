import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const Preview = ({ content = "" }: { content: string }) => {
  const formattedContent = content
    .replace(/\\/g, "")
    .replace(/&#x20;/g, "")
    .replace(/DataRenderer<T>/g, "DataRenderer&lt;T&gt;")
    .replace(/<T>/g, "&lt;T&gt;");
  return (

    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};

export default Preview;
