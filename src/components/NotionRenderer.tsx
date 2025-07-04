import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

interface NotionRendererProps {
  blocks: (BlockObjectResponse | PartialBlockObjectResponse)[];
}

export default function NotionRenderer({ blocks }: NotionRendererProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      {blocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function RenderBlock({
  block,
}: {
  block: BlockObjectResponse | PartialBlockObjectResponse;
}) {
  if (!("type" in block)) {
    return null;
  }

  const { type, id } = block;

  switch (type) {
    case "paragraph":
      return (
        <p className="mb-4">
          <RichText text={block.paragraph.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h1 id={id} className="text-3xl font-bold mt-8 mb-4 scroll-mt-20">
          <RichText text={block.heading_1.rich_text} />
        </h1>
      );

    case "heading_2":
      return (
        <h2 id={id} className="text-2xl font-semibold mt-6 mb-3 scroll-mt-20">
          <RichText text={block.heading_2.rich_text} />
        </h2>
      );

    case "heading_3":
      return (
        <h3 id={id} className="text-xl font-semibold mt-4 mb-2 scroll-mt-20">
          <RichText text={block.heading_3.rich_text} />
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li className="ml-4 mb-1">
          <RichText text={block.bulleted_list_item.rich_text} />
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="ml-4 mb-1">
          <RichText text={block.numbered_list_item.rich_text} />
        </li>
      );

    case "to_do":
      return (
        <div className="flex items-start gap-2 mb-2">
          <input
            type="checkbox"
            checked={block.to_do.checked}
            readOnly
            className="mt-1"
          />
          <span
            className={block.to_do.checked ? "line-through opacity-70" : ""}
          >
            <RichText text={block.to_do.rich_text} />
          </span>
        </div>
      );

    case "toggle":
      return (
        <details className="mb-4">
          <summary className="cursor-pointer font-medium">
            <RichText text={block.toggle.rich_text} />
          </summary>
          <div className="ml-4 mt-2">{/* Render children blocks if any */}</div>
        </details>
      );

    case "code":
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
          <code className={`language-${block.code.language}`}>
            <RichText text={block.code.rich_text} />
          </code>
        </pre>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-4 bg-blue-50 dark:bg-blue-950 p-4 rounded-r-lg">
          <RichText text={block.quote.rich_text} />
        </blockquote>
      );

    case "callout":
      const emoji =
        block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";
      return (
        <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg mb-4 border-l-4 border-yellow-400">
          <span className="text-xl flex-shrink-0">{emoji}</span>
          <div>
            <RichText text={block.callout.rich_text} />
          </div>
        </div>
      );

    case "divider":
      return <hr className="my-8 border-gray-300 dark:border-gray-700" />;

    case "image":
      const imageUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption =
        block.image.caption?.length > 0
          ? block.image.caption.map((text) => text.plain_text).join("")
          : "";

      return (
        <figure className="mb-6">
          <img
            src={imageUrl}
            alt={caption || "이미지"}
            className="w-full rounded-lg shadow-md"
          />
          {caption && (
            <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );

    case "bookmark":
      return (
        <a
          href={block.bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4"
        >
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {block.bookmark.url}
          </div>
          {block.bookmark.caption?.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <RichText text={block.bookmark.caption} />
            </div>
          )}
        </a>
      );

    default:
      return (
        <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          지원하지 않는 블록 타입: {type}
        </div>
      );
  }
}

function RichText({
  text,
}: {
  text: Array<{
    type: string;
    plain_text: string;
    annotations: {
      bold: boolean;
      code: boolean;
      color: string;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
    };
    href?: string | null;
  }>;
}) {
  return (
    <>
      {text.map((value, index) => {
        const {
          annotations: { bold, code, color, italic, strikethrough, underline },
          plain_text,
          href,
        } = value;

        let element = (
          <span
            key={index}
            className={[
              bold && "font-bold",
              italic && "italic",
              strikethrough && "line-through",
              underline && "underline",
              code &&
                "bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono",
            ]
              .filter(Boolean)
              .join(" ")}
            style={color !== "default" ? { color } : {}}
          >
            {plain_text}
          </span>
        );

        if (href) {
          element = (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {element}
            </a>
          );
        }

        return element;
      })}
    </>
  );
}
