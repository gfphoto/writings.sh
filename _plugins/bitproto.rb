# frozen_string_literal: true

Jekyll::Hooks.register :site, :pre_render do |site|
  require "rouge"
    class BitprotoLexer < Rouge::Lexers::Protobuf
      title 'bitproto'
      desc 'bitproto syntax lexer'
      tag 'bitproto'
      aliases 'bitproto'
      filenames '*.bitproto'

      kw = /\b(proto|type|const|message|enum|option|import)\b/
      datatype = /\b(bool|bytes|int8|int16|int32|int64)\b/

      state :root do
        rule %r/[\s]+/, Text
        rule %r/\/\/(.*?)\n/, Comment
        rule kw, Keyword
        rule datatype, Keyword::Type
        rule %r/uint[0-9]+/, Keyword::Type

        rule %r/".*?"/, Str
        rule %r/true|false|yes|no/, Keyword::Constant
        rule %r/[0-9]+/, Num::Integer
        rule %r/0[xX][0-9a-fA-F]+/, Num::Hex
        rule %r/[+\-*]/, Operator
        rule %r/[a-zA-Z_][a-zA-Z0-9_]*/, Name
        rule %r/[:;{}\[\]()=\\'.]/, Punctuation

      end
    end
end
