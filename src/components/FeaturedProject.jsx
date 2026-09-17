import Tag from './Tag'

export default function FeaturedProject({ id, title, subtitle, description, tags, image, github, demo }) {
  return (
    <article className="flex flex-col gap-8 mb-24 last:mb-0 group">
      
      {/* Text Content */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-[35%] flex flex-col gap-3">
          <span className="font-mono text-text-3 text-sm">{id}</span>
          <h3 className="font-sans font-bold text-3xl md:text-4xl text-text-1 tracking-tight">
            {title}
          </h3>
          <p className="font-serif italic text-lg text-text-2 mt-1">
            {subtitle}
          </p>
        </div>

        <div className="md:w-[65%] flex flex-col gap-6">
          <p className="text-text-2 text-lg leading-relaxed max-w-[600px]">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="flex gap-6 mt-4">
            {demo && demo !== '#' && (
              <a
                href={demo}
                className="text-sm font-bold text-text-1 hover:text-accent transition-colors underline decoration-border-strong underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live Product ↗
              </a>
            )}
            {github && github !== '#' && (
              <a
                href={github}
                className="text-sm font-bold text-text-2 hover:text-accent transition-colors underline decoration-border-strong underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Source ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Large Visual */}
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-background-2 border border-border-strong overflow-hidden relative">
        <img 
          src={image} 
          alt={`${title} project preview`}
          className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700"
          onError={(e) => {
            // Fallback for missing images to show a clean placeholder
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
            e.target.parentElement.innerHTML = `<span class="text-text-3 font-mono text-sm">[ Image Placeholder: ${image} ]</span>`;
          }}
        />
      </div>

    </article>
  )
}
