require './pubnubpublishpool'

puts '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-'
puts 'Welcome, this Ruby Code will create a connection pool to the '
puts 'PubNub Real-time Network allow fast parallel publishing.'
puts '-------------------------------------------------------------------'
puts 'The larger the pool size, the more parallel publishes can be made.'
puts 'Be Careful ~ the OS has a max limit of outbound connections. ~'
puts '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-'

puts ' ~ WARNING:  ~'
puts ' ~ WARNING: THIS RUBY SCRIPT *CAN* PUBLISH TOO FAST ~'
puts ' ~ WARNING: YOU CAN ONLY USE THIS SCRIPT TO ~'
puts ' ~ WARNING: PUBLISH TO SEPARATE CLIENTS ON SEPARATE CHANNELS ~'
puts ' ~ WARNING: PLEASE CONTACT PUBNUB DIRECTLY FOR DETAILS ~'
puts ' ~ WARNING:  ~'

EventMachine.run do
    puts ' ~ WARNING: PRE WARMING CONNECTION POOL, PLEASE WAIT ~'
    puts ' ~ WARNING: PRE WARMING CONNECTION POOL, PLEASE WAIT ~'
    puts ''
    puts 'RECEIVE TEST MESSAGES BY VISITING: '
    puts ''
    puts 'http://www.pubnub.com/console?channel=my_channel&pub=demo&sub=demo'
    puts ''

    publisher = PubNubPublishPool.new({
        :publish_key   => 'demo',
        :subscribe_key => 'demo',
        :pre_warm      => true,   ## Pre-connect Entire Pool
        :pool_size     => 50      ## Size of Pool (Default 10)
    })

    puts 'ABOUT TO START PUBLISHING REALLY, REALLY FAST!'
    10000.times do |i|
        publisher.publish({
            :channel  => "my_channel",
            :message  => "PUBLISH -> %s" % (i+1)
        })
    end
end
