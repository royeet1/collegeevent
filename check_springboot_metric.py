#!/usr/bin/env python3
import sys
import json
import urllib.request
import argparse

def main():
    parser = argparse.ArgumentParser(description='Check Spring Boot Actuator Metric for Nagios')
    parser.add_argument('-u', '--url', required=True, help='Actuator metric URL')
    parser.add_argument('-w', '--warning', type=float, required=True, help='Warning threshold')
    parser.add_argument('-c', '--critical', type=float, required=True, help='Critical threshold')
    parser.add_argument('-l', '--less', action='store_true', help='Alert if metric is less than threshold')
    
    args = parser.parse_args()
    
    try:
        req = urllib.request.Request(args.url, headers={'User-Agent': 'Nagios-Check'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            val = data['measurements'][0]['value']
            name = data['name']
    except Exception as e:
        print(f"UNKNOWN - Failed to fetch or parse metric: {str(e)}")
        sys.exit(3)
        
    # Check threshold
    if args.less:
        if val <= args.critical:
            print(f"CRITICAL - {name}: {val} | {name}={val};{args.warning};{args.critical}")
            sys.exit(2)
        elif val <= args.warning:
            print(f"WARNING - {name}: {val} | {name}={val};{args.warning};{args.critical}")
            sys.exit(1)
        else:
            print(f"OK - {name}: {val} | {name}={val};{args.warning};{args.critical}")
            sys.exit(0)
    else:
        if val >= args.critical:
            print(f"CRITICAL - {name}: {val} | {name}={val};{args.warning};{args.critical}")
            sys.exit(2)
        elif val >= args.warning:
            print(f"WARNING - {name}: {val} | {name}={val};{args.warning};{args.critical}")
            sys.exit(1)
        else:
            print(f"OK - {name}: {val} | {name}={val};{args.warning};{args.critical}")
            sys.exit(0)

if __name__ == '__main__':
    main()
