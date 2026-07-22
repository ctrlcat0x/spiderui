"use client";

import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur";

const paragraph =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, reiciendis eum vitae nostrum, temporibus repudiandae voluptatibus, natus iure ipsa velit odit quibusdam illum. Quaerat cumque laudantium libero reprehenderit perferendis quo nulla voluptate? Repellat tenetur labore exercitationem dicta libero voluptate suscipit, iusto ea assumenda. Ipsa enim, quidem atque modi error eaque, debitis perferendis, hic iste libero dignissimos ea! Quod inventore beatae aspernatur nulla rem perferendis aperiam at debitis delectus odit quia animi ex mollitia vero molestias itaque deleniti, quos exercitationem consequatur assumenda dolor?";

export function ProgressiveBlurPreview() {
  return (
    <div className="relative h-[620px] w-full overflow-hidden bg-[var(--progressive-blur-preview-bg)] text-foreground [--progressive-blur-preview-bg:#fff] dark:[--progressive-blur-preview-bg:#121212]">
      <div
        data-progressive-blur-demo
        className="h-full overflow-y-auto px-8 py-24 sm:px-16"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-28 pb-36 text-[1.35rem] leading-[1.55] tracking-[-0.025em] text-foreground/55 sm:text-2xl">
          {[0, 1, 2].map((index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <ProgressiveBlur
        position="both"
        height="26%"
        backgroundColor="var(--progressive-blur-preview-bg)"
        blurLevels={[0.5, 1, 2, 4, 8, 14, 22, 32]}
      />
    </div>
  );
}
