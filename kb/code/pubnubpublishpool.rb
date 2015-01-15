require 'rubygems'
require 'eventmachine'
require 'em-http'
require 'json'
require 'open-uri'

class PubNubPublishPool
    def initialize(args={})
        @publish_key     = args[:publish_key]  
        @subscribe_key   = args[:subscribe_key]
        @secret_key      = args[:secret_key] || "0"
        @pre_warm        = args[:pre_warm]   || false
        @pool_size       = args[:pool_size]  || 10
        @connection_pos  = 0
        @connection_pool = []
        @publish_queue   = []

        ## Open Connection Pool
        @pool_size.times do
            @connection_pool.push({
                :ready => 1,
                :issue => EventMachine::HttpRequest.new(
                    'http://p'+rand(999).to_s+'.pubnub.com/'
                )
            })
        end

        ## Pre-connect
        if @pre_warm == true
            @connection_pool.each do |conn|
                conn[:issue].get({
                    :keepalive => true,
                    :path      => '/time/0'
                })
            end
        end
    end

    def publish(args={})
        channel = args[:channel]
        message = args[:message]
        path    = '/publish/%s/%s/0/%s/0/%s' % [
            @publish_key,
            @subscribe_key,
            _encode(channel),
            _encode(message.to_json)
        ]

        _request(path)
    end

    private
    def _request(path)
        ## Get Connection and Iterate Queue Position
        if @connection_pos >= @pool_size
            @connection_pos = 0
        end
        conn = @connection_pool[@connection_pos]
        @publish_queue.push(path)
        @connection_pos += 1

        ## Leave if a Connection is in waiting and
        ## try again after Successful request.
        if conn[:ready] == 0
            return nil
        end

        conn[:ready] = 0

        ## Send Messages
        _send_queue(conn)
    end

    def _send_queue(conn)
        if @publish_queue.size == 0
            return nil
        end

        url = @publish_queue.shift
        req = conn[:issue].get({
            :keepalive => true,
            :path      => url
        })

        req.callback {
            conn[:ready] = 1
            #puts "DONE: %s" % req.response
            _send_queue(conn)
        }

        req.errback  {
            conn[:ready] = 1
            #puts "ERROR: %s" % req.response
        }
    end

    def _encode(value)
        ## Encode URL
        return value.split('').map { |ch|
            '`!@#$%^&*()+\\/?'.index(ch)         ?
            '%' + ch.unpack('H2')[0].to_s.upcase :
            URI.encode(ch)
        }.join('')
    end

end
