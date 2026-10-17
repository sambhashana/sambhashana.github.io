require 'digest'

module Jekyll
  module SiteCssCache
    # Include Sass partials: the upstream filter assumes assets/_sass, but this
    # site's partials live in _sass. Hash source inputs before CSS is generated.
    def bust_site_css_cache(file_name)
      source = @context.registers[:site].source
      files = Dir.glob(File.join(source, '_sass', '**', '*')).select { |path| File.file?(path) }
      files << File.join(source, 'assets', 'css', 'main.scss')
      digest = Digest::SHA256.new
      files.sort.each do |path|
        digest << path.delete_prefix(source) << "\0" << File.binread(path) << "\0"
      end
      "#{file_name}?v=#{digest.hexdigest[0, 16]}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::SiteCssCache)
